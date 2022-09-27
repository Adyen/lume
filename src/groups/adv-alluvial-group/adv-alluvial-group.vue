<template>
  <g
    v-if="alluvialInstance"
    class="adv-alluvial-group"
    data-j-alluvial-group
  >
    <g
      v-for="(nodeBlock, index) in alluvialInstance.nodeBlocks"
      :id="`${nodeBlock.id}`"
      :key="`node-block_${index}`"
      class="adv-alluvial-group__node"
      :class="{
        'adv-alluvial-group__node--faded': isNodeOrLinkFaded(
          nodeBlock.id,
          highlightedNodeIds
        ),
      }"
      data-j-alluvial-group__node-block
    >
      <rect
        :class="`adv-alluvial-group__node-block--${
          nodeBlock.node.color || defaultColor
        }`"
        :transform="`translate(${nodeBlock.node.x0},${nodeBlock.node.y0})`"
        :height="nodeBlock.rect.height"
        :width="nodeBlock.rect.width"
        @mouseover="alluvialInstance.highlightedNode = nodeBlock.node"
        @mouseout="alluvialInstance.highlightedNode = null"
      />
      <text
        :id="`node-text-${nodeBlock.node.id}`"
        ref="nodeText"
        class="adv-alluvial-group__node-text"
        :class="{
          'adv-alluvial-group__node-text--right': nodeBlock.node.depth === 0,
          'adv-alluvial-group__node-text--color':
            nodeBlock.node.depth === maxDepth,
        }"
        :transform="`translate(${nodeBlock.textTransform.x},${nodeBlock.textTransform.y})`"
      >
        <tspan
          class="adv-alluvial-group__node-title"
          v-text="nodeBlock.node.label"
        />
        <tspan
          class="adv-alluvial-group__node-value"
          x="0"
          dy="1.2em"
          v-text="
            computedData.valueFormatter(
              nodeBlock.node.transitionValue || nodeBlock.node.value
            )
          "
        />
      </text>
    </g>
    <adv-alluvial-path-group
      :link-paths="alluvialInstance.linkPaths"
      is-ghost
      data-j-alluvial-group__ghost-path
      @mouseover="alluvialInstance.highlightedLink = $event"
      @mouseout="alluvialInstance.highlightedLink = null"
    />
    <adv-alluvial-path-group
      :link-paths="alluvialInstance.linkPaths"
      :container-width="alluvialInstance.containerSize.width"
      :highlighted-link-ids="highlightedLinkIds"
      data-j-alluvial-group__path
      @mouseover="alluvialInstance.highlightedLink = $event"
      @mouseout="alluvialInstance.highlightedLink = null"
    />
  </g>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, toRef, watch } from 'vue';

import AdvAlluvialPathGroup from '@/groups/adv-alluvial-path-group';

import { withChartProps } from '@/composables/props';

import { useAlluvialInteractions } from './composables/adv-alluvial-interactions';
import { useCoordinates } from './composables/adv-alluvial-coordinates';
import {
  getAlluvialComputedData,
  useAlluvialBlocks,
} from './composables/adv-alluvial-building-blocks';

import {
  getAlluvialNodeId,
  isNodeOrLinkFaded,
  singleDatasetValidator,
} from '@/utils/helpers';

import { AlluvialNode } from '@/types/alluvial';
import { Data } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

import { DEFAULT_COLOR, NODE_LABEL_PADDING } from './constants';

export default defineComponent({
  components: { AdvAlluvialPathGroup },
  props: {
    ...withChartProps(singleDatasetValidator),
  },
  setup(props, context) {
    const data = toRef(props, 'data') as Ref<Data<AlluvialNode>>;

    const highlightedLinkIds = ref([]);
    const highlightedNodeIds = ref([]);
    const nodeText = ref(null);

    const computedData = getAlluvialComputedData(data);

    const { graph, alluvialInstance } = useAlluvialBlocks(
      computedData,
      context.attrs.containerSize as ContainerSize
    );

    const {
      leftMostNodeLabelWidth,
      rightMostNodeLabelWidth,
      topMostNodeLabelExtraHeight,
      bottomMostNodeLabelExtraHeight,
    } = useCoordinates(computedData, graph, nodeText);

    const {
      highlightedElements,
      highlightLinks,
      updateNodes,
      renderChart,
      maxDepth,
    } = useAlluvialInteractions(alluvialInstance, computedData, graph);

    watch(highlightedElements, function (newElements, previousElements) {
      const isEntering = newElements.nodes != null && newElements.links != null;
      const links = new Set(newElements.links ?? []);
      const { nodes = new Map() } =
        (isEntering ? newElements : previousElements) || {};
      const { nodeIds, linkIds } = highlightLinks(
        graph.value?.links?.filter((link) => links.has(link))
      );
      const updateHighlightedBlocks = (_nodeIds = [], _linkIds = []) => {
        highlightedNodeIds.value = _nodeIds;
        highlightedLinkIds.value = _linkIds;
      };

      updateHighlightedBlocks(nodeIds, linkIds);
      updateNodes({
        isEntering,
        values: nodes,
        updatingNodes: graph.value?.nodes?.filter((node) =>
          nodes.has(getAlluvialNodeId(node))
        ),
      });
    });

    watch(graph, (sankeyElements) =>
      renderChart({ nodes: sankeyElements.nodes, links: sankeyElements.links })
    );

    watch(
      leftMostNodeLabelWidth,
      (width) =>
        (alluvialInstance.value.leftExtent = width + NODE_LABEL_PADDING)
    );

    watch(
      rightMostNodeLabelWidth,
      (width) =>
        (alluvialInstance.value.rightExtent =
          alluvialInstance.value.containerSize.width -
          (width + NODE_LABEL_PADDING))
    );

    watch(
      bottomMostNodeLabelExtraHeight,
      (height) => (alluvialInstance.value.bottomExtent = height)
    );

    watch(
      topMostNodeLabelExtraHeight,
      (height) => (alluvialInstance.value.topExtent = height)
    );

    watch(
      alluvialInstance.value.containerSize,
      (containerSize) =>
        (alluvialInstance.value.rightExtent =
          containerSize.width -
          (rightMostNodeLabelWidth.value + NODE_LABEL_PADDING))
    );

    return {
      alluvialInstance,
      computedData,
      defaultColor: DEFAULT_COLOR,
      highlightedLinkIds,
      highlightedNodeIds,
      isNodeOrLinkFaded,
      maxDepth,
      nodeText,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
