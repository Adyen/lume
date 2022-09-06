import { computed, ComputedRef, onBeforeUnmount, ref, Ref, set } from 'vue';
import { SankeyGraph, SankeyLink, sankeyLinkHorizontal, SankeyNode } from 'd3-sankey';
import { interpolateRound } from '@/utils/helpers';

import {
  AlluvialDataset,
  AlluvialInstance,
  NodeBlock,
  SankeyLinkAdditionalProperties,
  SankeyNodeAdditionalProperties,
} from '@/types/alluvial';

import { defaultChartColor, nodeToLabelGap, transitionDuration } from '@/charts/adv-alluvial-chart/defaults';


export function useAlluvialInteractions(
  alluvialInstance: Ref<AlluvialInstance>,
  alluvialProps: Ref<AlluvialDataset>,
  chartContainer: Ref<HTMLElement>,
  nodeId: (node: (string | number | SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>)) => string | number,
  graph: Ref<SankeyGraph<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>>,
) {

  const nodeIdRef = ref(nodeId);
  let isBeingDestroyed = false;

  onBeforeUnmount(() => {
    isBeingDestroyed = true;
  })

  const maxDepth = computed(() => {
    return Math.max(...graph.value.nodes.map(({ depth }) => depth));
  });

  const highlightedElements: ComputedRef<
        {
            links?: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>[],
            nodes?: Map<unknown, unknown>
        }
    > = computed(() => {
      if (alluvialInstance.value.highlightedLink === null && alluvialInstance.value.highlightedNode === null) return {};
      if (alluvialProps.value.getHighlightedElements) {
        return alluvialProps.value.getHighlightedElements({
          link: alluvialInstance.value.highlightedLink,
          node: alluvialInstance.value.highlightedNode,
          links: graph.value.links,
        });
      }
      if (alluvialInstance.value.highlightedNode) {
        const links = [...alluvialInstance.value.highlightedNode.sourceLinks, ...alluvialInstance.value.highlightedNode.targetLinks];
        return {
          links,
          nodes: new Map(
            links
              .reduce((acc, { source, target, value }) => {
                if (source === alluvialInstance.value.highlightedNode) {
                  return [...acc, [nodeIdRef.value(target), value]];
                }
                return [...acc, [nodeIdRef.value(source), value]];
              }, [])
          ),
        };
      }
      return {
        links: [alluvialInstance.value.highlightedLink],
        nodes: new Map([[nodeIdRef.value(alluvialInstance.value.highlightedLink.target), alluvialInstance.value.highlightedLink.value]]),
      };
    });

  function getIdentifier(element: number | string | SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>): number | string {
    if (typeof element === 'string' || typeof element === 'number') return element;
    else return element?.id;
  }

  function highlightLinks(highlightedLinks: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>[] = graph.value.links, isEntering = false) {
    const linkIds = highlightedLinks
      .map(_link => `link_${getIdentifier(_link.source)}:${getIdentifier(_link.target)}`);
    const nodeIds = highlightedLinks
      .reduce((acc, { source, target }) =>
          [...acc, `node-block-${getIdentifier(source)}`, `node-block-${getIdentifier(target)}`], []);
    return { nodeIds, linkIds }
  }


  function updateNode(id: number | string, currentNumber: number, targetNumber: number) {
    const startTime = Date.now();
    const nodeBlock = alluvialInstance.value.nodeBlocks.find(nodeBlock => nodeBlock.id === `node-block-${id}`);
    const interpolator = interpolateRound(currentNumber, targetNumber);

    const performNextUpdate = () => {
      if (isBeingDestroyed) return;
      const now = Date.now();
      let iteration = (now - startTime) / transitionDuration;
      if (iteration > 1) {
        iteration = 1;
      }

      set(nodeBlock.node, 'transitionValue', interpolator(iteration));

      if (iteration < 1) {
        requestAnimationFrame(performNextUpdate);
      }
    };
    requestAnimationFrame(performNextUpdate);
  }

  function updateNodes({
    values,
    updatingNodes = [],
    isEntering = false,
  }) {
    const nodes = new Set(updatingNodes);
    const getStartNumber = node => {
      if (isEntering) return node.value;
      return values.get(nodeIdRef.value(node));
    };
    const getEndNumber = node => {
      if (isEntering) return values.get(nodeIdRef.value(node));
      return node.value;
    };
    graph.value.nodes.filter(node => nodes.has(node))
      .forEach(node => {
        updateNode(nodeIdRef.value(node), getStartNumber(node), getEndNumber(node));
      });
  }

  function computeLinkPaths(links) {
    const pathDirection = sankeyLinkHorizontal();
    return links.map(link => ({
      id: `link_${nodeIdRef.value(link.source)}:${nodeIdRef.value(link.target)}`,
      d: pathDirection(link),
      color: link.color || link.source?.color || defaultChartColor,
      strokeWidth: Math.max(1, link.width),
      link
    }));
  }

  function computeNodeBlocks(nodes): Array<NodeBlock> {
    return nodes.map(node => ({
      id: `node-block-${nodeIdRef.value(node)}`,
      rect: {
        cssClass: ({ color = defaultChartColor }) => `adv-alluvial-group__node-block--${color}`,
        width: node.x1 - node.x0,
        height: node.y1 - node.y0
      },
      textTransform: {
        x: node.depth > 0 ? node.x1 + nodeToLabelGap : node.x0 - nodeToLabelGap,
        y: (node.y1 + node.y0) / 2
      },
      node
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
    maxDepth
  };
}