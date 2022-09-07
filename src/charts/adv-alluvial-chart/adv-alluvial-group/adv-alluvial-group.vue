<template>
  <g
    ref="chartContainer"
    class="adv-alluvial-group"
    data-j-alluvial-group
  >
    <g
      v-for="(nodeBlock, index) in alluvialInstance.nodeBlocks"
      :id="`${nodeBlock.id}`"
      :key="`node-block_${index}`"
      class="adv-alluvial-group__node"
      :class="{
        'adv-alluvial-group__node--out':
          highlightedNodeIds.length &&
          highlightedNodeIds.indexOf(nodeBlock.id) === -1,
      }"
      data-j-alluvial-group__node-block
    >
      <rect
        :transform="`translate(${nodeBlock.node.x0},${nodeBlock.node.y0})`"
        :height="nodeBlock.rect.height"
        :width="nodeBlock.rect.width"
        :class="`${nodeBlock.rect.cssClass({ color: nodeBlock.node.color })}`"
        @mouseover="alluvialInstance.highlightedNode = nodeBlock.node"
        @mouseout="alluvialInstance.highlightedNode = null"
      />
      <text
        :id="`node-text-${nodeBlock.node.id}`"
        ref="nodeText"
        class="adv-alluvial-group__node-text"
        :transform="`translate(${nodeBlock.textTransform.x},${nodeBlock.textTransform.y})`"
        :class="{
          'adv-alluvial-group__node-text--right': nodeBlock.node.depth === 0,
          'adv-alluvial-group__node-text--color':
            nodeBlock.node.depth === maxDepth,
        }"
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
            dataWithDefaults.valueFormatter(
              nodeBlock.node.transitionValue || nodeBlock.node.value
            )
          "
        />
      </text>
    </g>
    <adv-alluvial-path-group
      :link-paths="alluvialInstance.linkPaths"
      is-ghost-path
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
import { defineComponent, ref, toRefs, watch } from 'vue';
import { useBase } from '@/mixins/base';
import { withChartProps } from '@/mixins/props';

import { useAlluvialInteractions } from '@/charts/adv-alluvial-chart/mixins/adv-alluvial-interactions';
import { useCoordinates } from '../mixins/adv-alluvial-coordinates';
import {
  useAlluvialBlocks,
  useDefaultData,
} from '@/charts/adv-alluvial-chart/mixins/adv-alluvial-building-blocks';

import { singleDatasetValidator } from '@/utils/helpers';

import {
  baseData,
  nodeToLabelGap,
  ghostStrokeWidthOffset,
} from '@/charts/adv-alluvial-chart/defaults';
import { ContainerSize } from '@/types/size';
import AdvAlluvialPathGroup from '@/charts/adv-alluvial-chart/adv-alluvial-path-group/adv-alluvial-path-group.vue';

export default defineComponent({
  components: { AdvAlluvialPathGroup },
  props: {
    ...withChartProps(singleDatasetValidator),
  },
  setup(props, context) {
    const chartContainer = ref(null);
    const highlightedLinkIds = ref([]);
    const highlightedNodeIds = ref([]);
    const nodeText = ref(null);

    const { data } = toRefs(props);
    const { computedData } = useBase(data);
    const dataWithDefaults = useDefaultData(computedData.value[0], baseData);
    const { graph, nodeId, alluvialInstance } = useAlluvialBlocks(
      dataWithDefaults,
      context.attrs.containerSize as ContainerSize
    );

    const {
      leftMostNodeLabelWidth,
      rightMostNodeLabelWidth,
      topMostNodeLabelExtraHeight,
      bottomMostNodeLabelExtraHeight,
    } = useCoordinates(dataWithDefaults, graph, nodeText);

    const {
      highlightedElements,
      highlightLinks,
      updateNodes,
      renderChart,
      maxDepth,
    } = useAlluvialInteractions(
      alluvialInstance,
      dataWithDefaults,
      chartContainer,
      nodeId,
      graph
    );

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
          nodes.has(nodeId(node))
        ),
      });
    });
    watch(graph, (sankeyElements) =>
      renderChart({ nodes: sankeyElements.nodes, links: sankeyElements.links })
    );
    watch(
      leftMostNodeLabelWidth,
      (width) => (alluvialInstance.value.leftExtent = width + nodeToLabelGap)
    );
    watch(
      rightMostNodeLabelWidth,
      (width) =>
        (alluvialInstance.value.rightExtent =
          alluvialInstance.value.containerSize.width - (width + nodeToLabelGap))
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
          (rightMostNodeLabelWidth.value + nodeToLabelGap))
    );

    return {
      chartContainer,
      alluvialInstance,
      maxDepth,
      dataWithDefaults,
      ghostStrokeWidthOffset,
      highlightedNodeIds,
      highlightedLinkIds,
      nodeText,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
