import { computed, ComputedRef, onMounted, ref, Ref } from '@vue/composition-api';
import { SankeyGraph, SankeyNode } from 'd3-sankey';
import { select } from 'd3-selection';

import {
  AlluvialDataset,
  SankeyLinkAdditionalProperties,
  SankeyNodeAdditionalProperties
} from '@/types/alluvial';


export function useCoordinates(
  alluvialProps: Ref<AlluvialDataset>,
  graph: Ref<SankeyGraph<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>>,
  chartContainer: Ref<HTMLElement>,
  nodeId: (node: (string | number | SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>)) => string | number
) {

  const drawingBoard = ref(null);
  const nodeIdRef = ref(nodeId);

  onMounted(() => {
    drawingBoard.value = select(chartContainer.value);
  })

  function getNodesMaximum(coordinate: string) {
    return graph.value?.nodes?.reduce((acc, currentNode) => Math.max(acc, currentNode[coordinate]), -Infinity);
  }

  function byMaxNodeLength(nodeA, nodeB): number {
    return nodeMaxLength(nodeB) - nodeMaxLength(nodeA);
  }

  function getNodeLabelBBoxByNodeId(node): SVGRect {
    return drawingBoard.value?.select(`#node-block-${nodeIdRef.value?.(node)} .adv-alluvial-group__node-text`)?.node()?.getBBox()
  }

  function nodeMaxLength({ label, value }): number {
    return Math.max(label.length, alluvialProps.value.valueFormatter(value)?.length || 0);
  }

  const rightMostNodeLabelWidth = computed(() => {
    const maxX1 = getNodesMaximum('x1');
    const longestLastLevelNode = graph.value.nodes?.filter(({ x1 }) => x1 === maxX1)
      .sort(byMaxNodeLength)?.[0];
    if (longestLastLevelNode == null) return 0;
    return getNodeLabelBBoxByNodeId(longestLastLevelNode)?.width ?? 0;
  });

  const topMostNodeLabelExtraHeight = computed(() => {
    const minY0 = graph.value?.nodes?.reduce((acc, { y0 }) => Math.min(acc, y0), Infinity);
    const highestLabelNode = graph.value?.nodes?.find(({ y0 }) => y0 === minY0);
    if (highestLabelNode == null) return 0;
    return Math.abs(getNodeLabelBBoxByNodeId(highestLabelNode)?.y ?? 0);
  });

  const bottomMostNodeLabelExtraHeight = computed(() => {
    const maxY1 = getNodesMaximum('y1');
    const lowestLabelNode = graph.value?.nodes?.find(({ y1 }) => y1 === maxY1);
    if (lowestLabelNode == null) return 0;
    return Math.abs(getNodeLabelBBoxByNodeId(lowestLabelNode)?.y ?? 0);
  });

  const leftMostNodeLabelWidth: ComputedRef<number> = computed(() => {
    const longestFirstLevelNode = graph.value.nodes?.filter(({ depth }) => depth === 0)
      .sort(byMaxNodeLength)?.[0];
    if (longestFirstLevelNode == null) return 0;
    return getNodeLabelBBoxByNodeId(longestFirstLevelNode)?.width ?? 0;
  });

  return {
    leftMostNodeLabelWidth,
    rightMostNodeLabelWidth,
    topMostNodeLabelExtraHeight,
    bottomMostNodeLabelExtraHeight
  }
}