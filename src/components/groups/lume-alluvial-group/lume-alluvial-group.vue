<template>
  <g
    v-if="alluvialInstance"
    class="lume-alluvial-group"
    data-j-alluvial-group
  >
    <g
      v-for="(nodeBlock, index) in alluvialInstance.nodeBlocks"
      :id="`${nodeBlock.id}`"
      :key="`node-block_${index}`"
      class="lume-alluvial-group__node"
      :class="{
        'lume-alluvial-group__node--faded': isNodeOrLinkFaded(
          nodeBlock.id,
          highlightedNodeIds
        ),
      }"
      data-j-alluvial-group__node-block
    >
      <rect
        :class="`lume-alluvial-group__node-block--${
          nodeBlock.node.color || DEFAULT_COLOR
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
        class="lume-alluvial-group__node-text lume-typography--caption"
        :class="{
          'lume-alluvial-group__node-text--right': nodeBlock.node.depth === 0,
        }"
        :transform="`translate(${nodeBlock.textTransform.x},${nodeBlock.textTransform.y})`"
      >
        <tspan
          class="lume-alluvial-group__node-title"
          v-text="nodeBlock.node.label"
        />
        <tspan
          class="lume-alluvial-group__node-value"
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
    <lume-alluvial-path-group
      :link-paths="alluvialInstance.linkPaths"
      is-ghost
      data-j-alluvial-group__ghost-path
      @mouseover="alluvialInstance.highlightedLink = $event"
      @mouseout="alluvialInstance.highlightedLink = null"
    />
    <lume-alluvial-path-group
      :link-paths="alluvialInstance.linkPaths"
      :container-width="alluvialInstance.containerSize.width"
      :highlighted-link-ids="highlightedLinkIds"
      data-j-alluvial-group__path
      @mouseover="alluvialInstance.highlightedLink = $event"
      @mouseout="alluvialInstance.highlightedLink = null"
    />
  </g>
</template>

<script setup lang="ts">
import { Ref, ref, toRef, useAttrs, watch } from 'vue';

import LumeAlluvialPathGroup from './components/lume-alluvial-path-group.vue';

import { withGroupProps } from '../composables/group-props';

import { useAlluvialInteractions } from './composables/lume-alluvial-interactions';
import { useCoordinates } from './composables/lume-alluvial-coordinates';
import {
  getAlluvialComputedData,
  useAlluvialBlocks,
} from './composables/lume-alluvial-building-blocks';

import { getAlluvialNodeId, isNodeOrLinkFaded } from '@/utils/helpers';

import { AlluvialNode } from '@/types/alluvial';
import { Data } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

import { DEFAULT_COLOR, NODE_LABEL_PADDING } from './constants';

const props = defineProps({
  ...withGroupProps(),
});

const attrs = useAttrs();

const data = toRef(props, 'data') as Ref<Data<AlluvialNode>>;

const highlightedLinkIds = ref([]);
const highlightedNodeIds = ref([]);
const nodeText = ref(null);

const computedData = getAlluvialComputedData(data);

const { graph, alluvialInstance } = useAlluvialBlocks(
  computedData,
  attrs.containerSize as ContainerSize
);

const {
  leftMostNodeLabelWidth,
  rightMostNodeLabelWidth,
  topMostNodeLabelExtraHeight,
  bottomMostNodeLabelExtraHeight,
} = useCoordinates(computedData, graph, nodeText);

const { highlightedElements, highlightLinks, updateNodes, renderChart } =
  useAlluvialInteractions(alluvialInstance, computedData, graph);

watch(highlightedElements, (newElements, previousElements) => {
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
  (width) => (alluvialInstance.value.leftExtent = width + NODE_LABEL_PADDING)
);

watch(
  rightMostNodeLabelWidth,
  (width) =>
    (alluvialInstance.value.rightExtent =
      alluvialInstance.value.containerSize.width - (width + NODE_LABEL_PADDING))
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
</script>

<style lang="scss" scoped>
@use './styles';
</style>
