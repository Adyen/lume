<template>
  <g
    ref="chartContainer"
    class="adv-alluvial-group"
  >
    <g
      v-for="(nodeBlock, index) in alluvialInstance.nodeBlocks"
      :id="`${nodeBlock.id}`"
      :key="`node-block_${index}`"
      class="adv-alluvial-group__node"
    >
      <rect
        :transform="`translate(${nodeBlock.node.x0},${nodeBlock.node.y0})`"
        :height="nodeBlock.rect.height"
        :width="nodeBlock.rect.width"
        :class="`${nodeBlock.rect.cssClass({'color':nodeBlock.node.color})}`"
        @mouseover="alluvialInstance.highlightedNode = nodeBlock.node"
        @mouseout="alluvialInstance.highlightedNode = null"
      />
      <text
        class="adv-alluvial-group__node-text"
        :transform="`translate(${nodeBlock.textTransform.x},${nodeBlock.textTransform.y})`"
        :class="{'adv-alluvial-group__node-text--right': nodeBlock.node.depth === 0, 'adv-alluvial-group__node-text--color': nodeBlock.node.depth === maxDepth }"
      >
        <tspan
          class="adv-alluvial-group__node-title"
          v-text="nodeBlock.node.label"
        />
        <tspan
          class="adv-alluvial-group__node-value"
          x="0"
          dy="1.2em"
          v-text="dataWithDefaults.valueFormatter(nodeBlock.node.value)"
        />
      </text>
    </g>
    <g
      v-for="(linkPath, index) in alluvialInstance.linkPaths"
      :key="`link-path_${index}`"
      class="adv-alluvial-group__path-group"
    >
      <g style="mix-blend-mode: multiply">
        <path
          :id="linkPath.id"
          :d="linkPath.d"
          :class="[`adv-stroke-color--${linkPath.color}`, `adv-alluvial-group__path--${linkPath.color}`, 'adv-alluvial-group__path']"
          :stroke-width="linkPath.strokeWidth"
          @mouseover="alluvialInstance.highlightedLink = linkPath.link"
          @mouseout="alluvialInstance.highlightedLink = null"
        />
      </g>
    </g>
  </g>
</template>

<script lang='ts'>
import { defineComponent, ref, toRefs, watch } from '@vue/composition-api';

import { useBase } from '@/mixins/base';
import { withChartProps } from '@/mixins/props';

import { useAlluvialInteractions } from '@/charts/adv-alluvial-chart/mixins/adv-alluvial-interactions';
import { useCoordinates } from '../mixins/adv-alluvial-coordinates';
import { useAlluvialBlocks, useDefaultData } from '@/charts/adv-alluvial-chart/mixins/adv-alluvial-building-blocks';

import { singleDatasetValidator } from '@/utils/helpers';

import { baseData, nodeToLabelGap } from '@/charts/adv-alluvial-chart/defaults';
import { ContainerSize } from '@/types/size';

export default defineComponent({
  props: {
    ...withChartProps(singleDatasetValidator, false)
  },
  setup(props, context) {
    const chartContainer = ref(null);
    const { data } = toRefs(props);
    const { computedData } = useBase(data);
    const dataWithDefaults = useDefaultData(computedData.value[0], baseData);

    const { graph, nodeId, alluvialInstance } = useAlluvialBlocks(dataWithDefaults, context.attrs.containerSize as ContainerSize);

    const {
      leftMostNodeLabelWidth,
      rightMostNodeLabelWidth,
      topMostNodeLabelExtraHeight,
      bottomMostNodeLabelExtraHeight
    } = useCoordinates(dataWithDefaults, graph, chartContainer, nodeId);

    const {
      highlightedElements,
      highlightLinks,
      updateNodes,
      renderChart,
      maxDepth
    } = useAlluvialInteractions(alluvialInstance, dataWithDefaults, chartContainer, nodeId,  graph);

    watch(highlightedElements, function (newElements, previousElements) {
      const isEntering = newElements.nodes != null && newElements.links != null;
      const links = new Set(newElements.links ?? []);
      const { nodes = new Map() } = (isEntering ? newElements : previousElements) || {};
      highlightLinks(graph.value?.links?.filter(link => links.has(link)), isEntering);
      updateNodes({
        isEntering,
        values: nodes,
        updatingNodes: graph.value?.nodes?.filter(node => nodes.has(nodeId(node))),
      });
    });
    watch(graph, sankeyElements => renderChart({nodes: sankeyElements.nodes, links: sankeyElements.links}));
    watch(leftMostNodeLabelWidth, width => alluvialInstance.value.leftExtent = width + nodeToLabelGap);
    watch(rightMostNodeLabelWidth, width => alluvialInstance.value.rightExtent = alluvialInstance.value.containerSize.width - (width + nodeToLabelGap));
    watch(bottomMostNodeLabelExtraHeight, height => alluvialInstance.value.bottomExtent = height);
    watch(topMostNodeLabelExtraHeight, height => alluvialInstance.value.topExtent = height);
    watch(alluvialInstance.value.containerSize, containerSize => alluvialInstance.value.rightExtent = containerSize.width - (rightMostNodeLabelWidth.value + nodeToLabelGap));

    return {
      chartContainer,
      alluvialInstance,
      maxDepth,
      dataWithDefaults
    }
  }
})
</script>

<style lang="scss" scoped>
@use './styles';
</style>