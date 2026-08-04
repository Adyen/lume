import { computed, ref, Ref, watch } from 'vue';
import { SankeyLink as D3SankeyLink } from 'd3-sankey';

import { getAlluvialNodeId } from '../helpers';

import type {
  AlluvialExtents,
  AlluvialNode,
  AlluvialNodeId,
  SankeyGraph,
  SankeyLink,
  SankeyLinkProps,
  SankeyNode,
  SankeyNodeProps,
} from '@/types/alluvial';
import type { InternalData } from '@/types/dataset';
import type { AlluvialDiagramOptions } from '@/types/options';

type LinkDefinition = D3SankeyLink<SankeyNodeProps, SankeyLinkProps>;
type ChildIdsByParentId = Map<AlluvialNodeId, Array<AlluvialNodeId>>;

const AGGREGATED_LINK_ID_SUFFIX = ':aggregated';

/**
 * Expandable nodes are nodes that declare a set of sub-nodes (`expandableNodes`).
 * Sub-nodes are left out of the layout while collapsed and their outgoing flows
 * are aggregated into their parent, so that the diagram columns stay in place
 * regardless of the expansion state.
 */
export function useExpandableNodes(data: Ref<InternalData<AlluvialNode>>) {
  const expandedNodeIds = ref<Array<AlluvialNodeId>>([]);

  const childIdsByParentId = computed<ChildIdsByParentId>(() => {
    const map: ChildIdsByParentId = new Map();

    data.value?.[0]?.values.forEach(({ value, expandableNodes }) => {
      if (expandableNodes?.length) map.set(value, [...expandableNodes]);
    });

    return map;
  });

  const parentIdByChildId = computed<Map<AlluvialNodeId, AlluvialNodeId>>(
    () => {
      const map = new Map<AlluvialNodeId, AlluvialNodeId>();

      childIdsByParentId.value.forEach((childIds, parentId) => {
        childIds.forEach((childId) => map.set(childId, parentId));
      });

      return map;
    }
  );

  function isExpandableNode(id: AlluvialNodeId) {
    return childIdsByParentId.value.has(id);
  }

  function isSubNode(id: AlluvialNodeId) {
    return parentIdByChildId.value.has(id);
  }

  function isExpandedNode(id: AlluvialNodeId) {
    return expandedNodeIds.value.includes(id);
  }

  function toggleNodeExpansion(id: AlluvialNodeId) {
    if (!isExpandableNode(id)) return;

    expandedNodeIds.value = isExpandedNode(id)
      ? expandedNodeIds.value.filter((expandedId) => expandedId !== id)
      : [...expandedNodeIds.value, id];
  }

  watch(data, () => (expandedNodeIds.value = []));

  return {
    childIdsByParentId,
    expandedNodeIds,
    isExpandableNode,
    isExpandedNode,
    isSubNode,
    parentIdByChildId,
    toggleNodeExpansion,
  };
}

/**
 * Builds the layout input for the collapsed graph: sub-nodes are removed and
 * their outgoing links are aggregated into a single link per parent/target pair.
 */
export function getCollapsedGraphInput(
  nodes: Array<SankeyNode>,
  linkDefinitions: Array<LinkDefinition>,
  childIdsByParentId: ChildIdsByParentId,
  parentIdByChildId: Map<AlluvialNodeId, AlluvialNodeId>
) {
  if (!nodes || !linkDefinitions || parentIdByChildId.size === 0) {
    return { nodes, links: linkDefinitions };
  }

  const links = linkDefinitions.filter(
    (link) =>
      !parentIdByChildId.has(getAlluvialNodeId(link.source)) &&
      !parentIdByChildId.has(getAlluvialNodeId(link.target))
  );
  const linkIds = new Set(links.map(({ id }) => id));

  childIdsByParentId.forEach((childIds, parentId) => {
    const aggregatedLinksByTargetId = new Map<AlluvialNodeId, LinkDefinition>();

    childIds.forEach((childId) => {
      getSourceLinkDefinitions(linkDefinitions, childId).forEach((link) => {
        const targetId = getAlluvialNodeId(link.target);
        const aggregatedLink = aggregatedLinksByTargetId.get(targetId);

        if (aggregatedLink) {
          aggregatedLink.value += link.value;
          return;
        }

        const id = `${parentId}:${targetId}`;

        aggregatedLinksByTargetId.set(targetId, {
          id: linkIds.has(id) ? `${id}${AGGREGATED_LINK_ID_SUFFIX}` : id,
          aggregatedFrom: parentId,
          color: link.color,
          curveFunction: link.curveFunction,
          source: parentId,
          target: targetId,
          value: link.value,
        } as LinkDefinition);
      });
    });

    links.push(...aggregatedLinksByTargetId.values());
  });

  return {
    nodes: nodes.filter((node) => !parentIdByChildId.has(node.id)),
    links,
  };
}

/**
 * Adds the sub-nodes of every expanded node to the graph, positioning them in
 * the gap between their parent's column and the following one, and replacing
 * the aggregated links with the actual parent/sub-node/target links.
 */
export function applyNodeExpansion({
  graph,
  nodes,
  linkDefinitions,
  expandedNodeIds,
  childIdsByParentId,
  options,
  extents,
}: {
  graph: SankeyGraph;
  nodes: Array<SankeyNode>;
  linkDefinitions: Array<LinkDefinition>;
  expandedNodeIds: Array<AlluvialNodeId>;
  childIdsByParentId: ChildIdsByParentId;
  options: AlluvialDiagramOptions;
  extents: AlluvialExtents;
}) {
  if (!graph?.nodes?.length) return;

  expandedNodeIds.forEach((parentId) => {
    const parent = graph.nodes.find((node) => node.id === parentId);
    const children = (childIdsByParentId.get(parentId) ?? [])
      .map((childId) => nodes.find((node) => node.id === childId))
      .filter(Boolean);

    if (!parent || !children.length) return;

    expandNode({ graph, parent, children, linkDefinitions, options, extents });
  });
}

function expandNode({
  graph,
  parent,
  children,
  linkDefinitions,
  options,
  extents,
}: {
  graph: SankeyGraph;
  parent: SankeyNode;
  children: Array<SankeyNode>;
  linkDefinitions: Array<LinkDefinition>;
  options: AlluvialDiagramOptions;
  extents: AlluvialExtents;
}) {
  const childValues = children.map((child) =>
    getChildValue(linkDefinitions, parent, child)
  );
  const totalValue = childValues.reduce((acc, value) => acc + value, 0);

  if (!totalValue) return;

  // Sub-node heights are proportional to their parent's, so that they add up to it
  const scale = (parent.y1 - parent.y0) / totalValue;

  positionChildNodes({
    parent,
    children,
    childValues,
    scale,
    graph,
    options,
    extents,
  });

  const parentToChildLinks = getParentToChildLinks({
    parent,
    children,
    childValues,
    scale,
    linkDefinitions,
  });

  getAggregatedLinks(graph, parent).forEach((aggregatedLink) => {
    const childToTargetLinks = getChildToTargetLinks({
      children,
      aggregatedLink,
      scale,
      linkDefinitions,
    });

    replaceLink(graph.links, aggregatedLink, childToTargetLinks);
    replaceLink(
      aggregatedLink.target.targetLinks,
      aggregatedLink,
      childToTargetLinks
    );
  });

  parent.sourceLinks = [
    ...parent.sourceLinks.filter(
      (link) => (link as LinkDefinition).aggregatedFrom !== parent.id
    ),
    ...parentToChildLinks,
  ];

  graph.links.push(...parentToChildLinks);
  graph.nodes.push(...children);
}

function positionChildNodes({
  parent,
  children,
  childValues,
  scale,
  graph,
  options,
  extents,
}: {
  parent: SankeyNode;
  children: Array<SankeyNode>;
  childValues: Array<number>;
  scale: number;
  graph: SankeyGraph;
  options: AlluvialDiagramOptions;
  extents: AlluvialExtents;
}) {
  const nodeWidth = parent.x1 - parent.x0;
  const gapStart = parent.x1;
  const gapEnd = getNextColumnX0(graph, parent) ?? extents.x1;
  const x0 = Math.max(gapStart, gapStart + (gapEnd - gapStart - nodeWidth) / 2);

  const heights = childValues.map((value) => value * scale);
  const spacings = getSubNodeSpacings(children, options.nodePadding ?? 0);
  const totalHeight = [...heights, ...spacings].reduce(
    (acc, value) => acc + value,
    0
  );

  let y = getSubNodeStackStart({ parent, children, totalHeight, extents });

  children.forEach((child, index) => {
    y += spacings[index];

    child.x0 = x0;
    child.x1 = x0 + nodeWidth;
    child.y0 = y;
    child.y1 = y + heights[index];
    // Fractional depth/layer keep sub-nodes out of the diagram's node columns
    child.depth = parent.depth + 0.5;
    child.layer = parent.layer + 0.5;
    child.parentNodeId = parent.id;
    child.value = childValues[index];
    child.sourceLinks = [];
    child.targetLinks = [];

    y = child.y1;
  });
}

/**
 * Space preceding each sub-node: its `offset`, when set, replaces the node
 * padding. The first sub-node's offset positions the whole stack instead.
 */
function getSubNodeSpacings(children: Array<SankeyNode>, nodePadding: number) {
  return children.map(({ offset }, index) => {
    if (index === 0) return 0;
    return typeof offset === 'number' ? offset : nodePadding;
  });
}

function getSubNodeStackStart({
  parent,
  children,
  totalHeight,
  extents,
}: {
  parent: SankeyNode;
  children: Array<SankeyNode>;
  totalHeight: number;
  extents: AlluvialExtents;
}) {
  const { offset } = children[0];

  // A statically offset stack is anchored to the top of its parent node
  if (typeof offset === 'number') return parent.y0 + offset;

  return clamp(
    (parent.y0 + parent.y1) / 2 - totalHeight / 2,
    extents.y0,
    Math.max(extents.y0, extents.y1 - totalHeight)
  );
}

function getParentToChildLinks({
  parent,
  children,
  childValues,
  scale,
  linkDefinitions,
}: {
  parent: SankeyNode;
  children: Array<SankeyNode>;
  childValues: Array<number>;
  scale: number;
  linkDefinitions: Array<LinkDefinition>;
}) {
  let y = parent.y0;

  return children.map((child, index) => {
    const definition = getLinkDefinition(linkDefinitions, parent.id, child.id);
    const width = childValues[index] * scale;
    const link = {
      id: definition?.id ?? `${parent.id}:${child.id}`,
      color: definition?.color,
      curveFunction: definition?.curveFunction,
      source: parent,
      target: child,
      value: childValues[index],
      width,
      y0: y + width / 2,
      y1: (child.y0 + child.y1) / 2,
    } as SankeyLink;

    y += width;
    child.targetLinks.push(link);

    return link;
  });
}

function getChildToTargetLinks({
  children,
  aggregatedLink,
  scale,
  linkDefinitions,
}: {
  children: Array<SankeyNode>;
  aggregatedLink: SankeyLink;
  scale: number;
  linkDefinitions: Array<LinkDefinition>;
}) {
  const target = aggregatedLink.target;
  // Sub-node links take over the vertical band of the link they replace
  let targetY = aggregatedLink.y1 - aggregatedLink.width / 2;

  return children.reduce((links: Array<SankeyLink>, child) => {
    const definition = getLinkDefinition(linkDefinitions, child.id, target.id);

    if (!definition) return links;

    const width = definition.value * scale;
    const childY = child.sourceLinks.reduce(
      (acc, { width: linkWidth }) => acc + linkWidth,
      child.y0
    );
    const link = {
      id: definition.id,
      color: definition.color,
      curveFunction: definition.curveFunction,
      source: child,
      target,
      value: definition.value,
      width,
      y0: childY + width / 2,
      y1: targetY + width / 2,
    } as SankeyLink;

    targetY += width;
    child.sourceLinks.push(link);
    links.push(link);

    return links;
  }, []);
}

function getAggregatedLinks(graph: SankeyGraph, parent: SankeyNode) {
  return graph.links.filter(
    (link) => (link as LinkDefinition).aggregatedFrom === parent.id
  );
}

function getSourceLinkDefinitions(
  linkDefinitions: Array<LinkDefinition>,
  sourceId: AlluvialNodeId
) {
  return linkDefinitions.filter(
    (link) => getAlluvialNodeId(link.source) === sourceId
  );
}

function getLinkDefinition(
  linkDefinitions: Array<LinkDefinition>,
  sourceId: AlluvialNodeId,
  targetId: AlluvialNodeId
) {
  return linkDefinitions.find(
    (link) =>
      getAlluvialNodeId(link.source) === sourceId &&
      getAlluvialNodeId(link.target) === targetId
  );
}

function getChildValue(
  linkDefinitions: Array<LinkDefinition>,
  parent: SankeyNode,
  child: SankeyNode
) {
  const definition = getLinkDefinition(linkDefinitions, parent.id, child.id);

  if (definition) return definition.value;

  // Fall back to the sub-node's own outgoing flow when the parent doesn't declare it
  return getSourceLinkDefinitions(linkDefinitions, child.id).reduce(
    (acc, { value }) => acc + value,
    0
  );
}

function getNextColumnX0(graph: SankeyGraph, parent: SankeyNode) {
  const nextColumnNodes = graph.nodes.filter(
    (node) => node.layer === parent.layer + 1
  );

  if (!nextColumnNodes.length) return null;

  return Math.min(...nextColumnNodes.map(({ x0 }) => x0));
}

function replaceLink<T>(links: Array<T>, link: T, replacements: Array<T>) {
  const index = links.indexOf(link);

  if (index === -1) {
    links.push(...replacements);
    return;
  }

  links.splice(index, 1, ...replacements);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}
