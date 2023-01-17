import Vue, { computed, ComputedRef, onBeforeUnmount, Ref } from 'vue';
import {
  SankeyGraph,
  SankeyLink,
  sankeyLinkHorizontal,
  SankeyNode,
} from 'd3-sankey';

import { getAlluvialNodeId, interpolateRound } from '@/utils/helpers';
import {
  DEFAULT_COLOR,
  NODE_LABEL_PADDING,
} from '@/components/groups/lume-alluvial-group/constants';

import {
  AlluvialDataset,
  AlluvialInstance,
  NodeBlock,
  SankeyLinkAdditionalProperties,
  SankeyNodeAdditionalProperties,
} from '@/types/alluvial';

const TRANSITION_DURATION = 200;

export function useAlluvialInteractions(
  alluvialInstance: Ref<AlluvialInstance>,
  alluvialProps: Ref<AlluvialDataset>,
  graph: Ref<
    SankeyGraph<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>
  >
) {
  let isBeingDestroyed = false;

  onBeforeUnmount(() => {
    isBeingDestroyed = true;
  });

  const highlightedElements: ComputedRef<{
    links?: SankeyLink<
      SankeyNodeAdditionalProperties,
      SankeyLinkAdditionalProperties
    >[];
    nodes?: Map<unknown, unknown>;
  }> = computed(() => {
    if (
      alluvialInstance.value.highlightedLink === null &&
      alluvialInstance.value.highlightedNode === null
    )
      return {};
    if (alluvialProps.value.getHighlightedElements) {
      return alluvialProps.value.getHighlightedElements({
        link: alluvialInstance.value.highlightedLink,
        node: alluvialInstance.value.highlightedNode,
        links: graph.value.links,
      });
    }
    if (alluvialInstance.value.highlightedNode) {
      const links = [
        ...alluvialInstance.value.highlightedNode.sourceLinks,
        ...alluvialInstance.value.highlightedNode.targetLinks,
      ];
      return {
        links,
        nodes: new Map(
          links.reduce((acc, { source, target, value }) => {
            if (source === alluvialInstance.value.highlightedNode) {
              return [...acc, [getAlluvialNodeId(target), value]];
            }
            return [...acc, [getAlluvialNodeId(source), value]];
          }, [])
        ),
      };
    }
    return {
      links: [alluvialInstance.value.highlightedLink],
      nodes: new Map([
        [
          getAlluvialNodeId(alluvialInstance.value.highlightedLink.target),
          alluvialInstance.value.highlightedLink.value,
        ],
      ]),
    };
  });

  function getIdentifier(
    element:
      | number
      | string
      | SankeyNode<
          SankeyNodeAdditionalProperties,
          SankeyLinkAdditionalProperties
        >
  ): number | string {
    if (typeof element === 'string' || typeof element === 'number')
      return element;
    else return element?.id;
  }

  function highlightLinks(
    highlightedLinks: SankeyLink<
      SankeyNodeAdditionalProperties,
      SankeyLinkAdditionalProperties
    >[] = graph.value.links
  ) {
    const linkIds = highlightedLinks.map(
      (_link) =>
        `link_${getIdentifier(_link.source)}:${getIdentifier(_link.target)}`
    );
    const nodeIds = highlightedLinks.reduce(
      (acc, { source, target }) => [
        ...acc,
        `node-block-${getIdentifier(source)}`,
        `node-block-${getIdentifier(target)}`,
      ],
      []
    );
    return { nodeIds, linkIds };
  }

  function updateNode(
    id: number | string,
    currentNumber: number,
    targetNumber: number
  ) {
    const startTime = Date.now();
    const nodeBlock = alluvialInstance.value.nodeBlocks.find(
      (nodeBlock) => nodeBlock.id === `node-block-${id}`
    );
    const interpolator = interpolateRound(currentNumber, targetNumber);

    const performNextUpdate = () => {
      if (isBeingDestroyed) return;
      const now = Date.now();
      let iteration = (now - startTime) / TRANSITION_DURATION;
      if (iteration > 1) {
        iteration = 1;
      }

      Vue.set(nodeBlock.node, 'transitionValue', interpolator(iteration));

      if (iteration < 1) {
        requestAnimationFrame(performNextUpdate);
      }
    };
    requestAnimationFrame(performNextUpdate);
  }

  function updateNodes({ values, updatingNodes = [], isEntering = false }) {
    const nodes = new Set(updatingNodes);
    const getStartNumber = (node) => {
      if (isEntering) return node.value;
      return values.get(getAlluvialNodeId(node));
    };
    const getEndNumber = (node) => {
      if (isEntering) return values.get(getAlluvialNodeId(node));
      return node.value;
    };
    graph.value.nodes
      .filter((node) => nodes.has(node))
      .forEach((node) => {
        updateNode(
          getAlluvialNodeId(node),
          getStartNumber(node),
          getEndNumber(node)
        );
      });
  }

  function computeLinkPaths(links) {
    const pathDirection = sankeyLinkHorizontal();
    return links.map((link) => ({
      id: `link_${getAlluvialNodeId(link.source)}:${getAlluvialNodeId(
        link.target
      )}`,
      d: pathDirection(link),
      color: link.color || link.source?.color || DEFAULT_COLOR,
      strokeWidth: Math.max(1, link.width),
      link,
    }));
  }

  function computeNodeBlocks(nodes): Array<NodeBlock> {
    return nodes.map((node) => ({
      id: `node-block-${getAlluvialNodeId(node)}`,
      rect: {
        width: node.x1 - node.x0,
        height: node.y1 - node.y0,
      },
      textTransform: {
        x:
          node.depth > 0
            ? node.x1 + NODE_LABEL_PADDING
            : node.x0 - NODE_LABEL_PADDING,
        y: (node.y1 + node.y0) / 2,
      },
      node,
    }));
  }

  function renderChart({ nodes, links }) {
    if (nodes == null || links == null) {
      return;
    }
    alluvialInstance.value.nodeBlocks = computeNodeBlocks(nodes);
    alluvialInstance.value.linkPaths = computeLinkPaths(links);
  }

  return {
    highlightedElements,
    highlightLinks,
    updateNodes,
    renderChart,
  };
}
