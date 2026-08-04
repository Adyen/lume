import { computed, ComputedRef, ref, Ref, watch } from 'vue';
import { SankeyLink as D3SankeyLink, sankey } from 'd3-sankey';

import { DEFAULT_COLOR } from '@/utils/colors';
import { OtherColors } from '@/types/utils';
import { Errors, error as logError } from '@/utils/errors';
import { getAlluvialNodeId } from '../helpers';
import {
  applyNodeExpansion,
  getCollapsedGraphInput,
  useExpandableNodes,
} from './alluvial-expandable-nodes';

import type {
  AlluvialExtents,
  AlluvialNode,
  SankeyGraph,
  SankeyLinkProps,
  SankeyNode,
  SankeyNodeProps,
} from '@/types/alluvial';
import type { InternalData } from '@/types/dataset';
import type { AlluvialDiagramOptions } from '@/types/options';

const EMPTY_GRAPH = {
  nodes: [],
  links: [],
} as SankeyGraph;

function getColumnByNode(node: SankeyNode, columns: Array<Array<SankeyNode>>) {
  return columns.find((column) => column.every((n) => n.layer === node.layer));
}

export function useAlluvialGraph(
  data: Ref<InternalData<AlluvialNode>>,
  options: Ref<AlluvialDiagramOptions>,
  extents: Ref<AlluvialExtents>
) {
  const sankeyGraph = ref<SankeyGraph>(null);

  const {
    childIdsByParentId,
    expandedNodeIds,
    isExpandableNode,
    isSubNode,
    parentIdByChildId,
    toggleNodeExpansion,
  } = useExpandableNodes(data);

  const nodes: ComputedRef<Array<SankeyNode>> = computed(() => {
    return data.value?.[0]?.values.map(
      ({
        label,
        color,
        value,
        deriveColorFromIncomingLinks,
        expandableNodes,
        offset,
      }) => ({
        label: label || value.toString(),
        color,
        fallbackColor: color || DEFAULT_COLOR,
        id: value,
        deriveColorFromIncomingLinks,
        expandableNodes,
        offset,
      })
    );
  });

  const links: ComputedRef<
    Array<D3SankeyLink<SankeyNodeProps, SankeyLinkProps>>
  > = computed(() =>
    data.value?.[0]?.values
      .map((source) =>
        source.targets?.map(
          ({ node: target, value, color, curveFunction }) => ({
            id: `${source.value}:${target}`,
            color,
            curveFunction,
            source: source.value ?? source.label,
            target,
            value,
          })
        )
      )
      .filter(Boolean)
      .flat()
  );

  const layout = computed(() => {
    return sankey<SankeyNodeProps, SankeyLinkProps>()
      .nodeId(getAlluvialNodeId)
      .nodeAlign(options.value.nodeAlign)
      .nodePadding(options.value.nodePadding)
      .nodeSort(options.value.nodeSort)
      .nodeWidth(options.value.nodeWidth)
      .linkSort(options.value.linkSort)
      .iterations(options.value.iterations);
  });

  const columns = computed<Array<Array<SankeyNode>>>(() => {
    return sankeyGraph.value?.nodes
      .filter((node) => node.parentNodeId == null) // Sub-nodes don't belong to any column
      .reduce((cols: Array<Array<SankeyNode>>, node: SankeyNode) => {
        const existingColumn = getColumnByNode(node, cols);
        if (existingColumn) {
          existingColumn.push(node);
          existingColumn.sort((a, b) => (a._y0 || a.y0) - (b._y0 || b.y0));
        } else {
          cols.push([node]);
        }
        return cols;
      }, [])
      .sort((a, b) => a[0].layer - b[0].layer);
  });

  function computeStaticNodePosition(node: SankeyNode) {
    const { offset } = node;
    const column = getColumnByNode(node, columns.value);

    if (!column) return;

    const previousNode = column[column.findIndex((n) => n.id === node.id) - 1];
    const y0 =
      previousNode && column.length !== 1 ? previousNode.y1 + offset : offset;

    // Save original positions as _y0 and _y1
    node._y0 = node.y0;
    node._y1 = node.y1;

    node.y0 = y0;
    node.y1 = node.y0 + (node._y1 - node._y0);
  }

  function computeLinksPositionForStaticNode(
    node: SankeyNode,
    graphObject: SankeyGraph
  ) {
    const { id, _y0, y0 } = node;
    const sourceLinks = graphObject.links.filter(
      (link) => link.source.id === id
    );
    const targetLinks = graphObject.links.filter(
      (link) => link.target.id === id
    );
    const offset = y0 - _y0;

    sourceLinks.forEach((link) => (link.y0 += offset));
    targetLinks.forEach((link) => (link.y1 += offset));
  }

  const graph = computed<SankeyGraph>(() => {
    if (sankeyGraph.value) {
      nodes.value?.forEach((node) => {
        if (node.value === 0) {
          node.fallbackColor = OtherColors.Grey;
        }

        // Sub-nodes are statically positioned within their parent's stack
        if (typeof node.offset === 'number' && !isSubNode(node.id)) {
          computeStaticNodePosition(node);
          computeLinksPositionForStaticNode(node, sankeyGraph.value);
        }
      });
    }
    return sankeyGraph.value;
  });

  watch([layout, extents, expandedNodeIds], () => {
    try {
      const { x0, y0, x1, y1 } = extents.value;
      const graphObject = layout.value.extent([
        [x0, y0],
        [x1, y1],
      ])(
        getCollapsedGraphInput(
          nodes.value,
          links.value,
          childIdsByParentId.value,
          parentIdByChildId.value
        )
      ) as SankeyGraph;

      applyNodeExpansion({
        graph: graphObject,
        nodes: nodes.value,
        linkDefinitions: links.value,
        expandedNodeIds: expandedNodeIds.value,
        childIdsByParentId: childIdsByParentId.value,
        options: options.value,
        extents: extents.value,
      });

      sankeyGraph.value = graphObject;
    } catch (error) {
      logError(Errors.GraphProblem, error);
      sankeyGraph.value = EMPTY_GRAPH;
    }
  });

  return { columns, graph, isExpandableNode, toggleNodeExpansion };
}
