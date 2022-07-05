<template>
  <chart-container @resize="updateSize">
    <g ref="chartContainer">
      <g
        v-for="(_, index) in alluvialInstance.nodeBlocks"
        :id="`${_.id}`"
        :key="`node-block_${index}`"
        class="node"
      >
        <rect
          :transform="`translate(${_.node.x0},${_.node.y0})`"
          :height="_.rect.height"
          :width="_.rect.width"
          :class="`${_.rect.cssClass({'color':_.node.color})}`"
          @mouseover="() => alluvialInstance.highlightedNode = _.node"
          @mouseout="() => alluvialInstance.highlightedNode = null"
        />
        <text
          class="node__label"
          :transform="`translate(${_.textTransform.x},${_.textTransform.y})`"
          :class="{'node__label--right': _.node.depth === 0, 'node__label--color': _.node.depth === maxDepth }"
        >
          <tspan
            class="node__label__title"
            v-text="_.node.label"
          />
          <tspan
            class="node__label__value"
            x="0"
            dy="1.2em"
            v-text="alluvialProps.valueFormatter(_.node.value)"
          />
        </text>
      </g>
      <g
        v-for="(_, index) in alluvialInstance.linkPaths"
        :key="`link-path_${index}`"
        class="path-group"
      >
        <g style="mix-blend-mode: multiply">
          <path
            :id="_.id"
            :d="_.d"
            :class="[`path-group__link--${_.color}`, 'path-group__link']"
            :stroke-width="_.strokeWidth"
            @mouseover="() => alluvialInstance.highlightedLink = _.link"
            @mouseout="() => alluvialInstance.highlightedLink = null"
          />
        </g>
      </g>
    </g>
  </chart-container>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from '@vue/composition-api';

import { withData, allAlluvialProps } from './mixins/alluvial-composables';
import { alluvialDefaults, nodeToLabelGap } from './defaults';
import { AlluvialInstance } from "@/types/alluvial";
import { useBase } from "@/charts/alluvial-chart/mixins/base";
import { drawPlot } from "@/charts/alluvial-chart/mixins/plot";
import ChartContainer from '@/core/chart-container';

export default defineComponent({
  components: { ChartContainer },
  props: {
    ...withData()
  },
  setup(props) {
    const chartContainer = ref(null);
    const { alluvialProps } = allAlluvialProps(props.data, alluvialDefaults);
    const alluvialData: Ref<AlluvialInstance> = ref({
      containerSize: { width: 0, height: 0 },
      highlightedLink: null,
      highlightedNode: null,
      leftExtent: 0,
      rightExtent: 0,
      topExtent: 0,
      bottomExtent: 0,
      nodeBlocks: [],
      linkPaths: []
    });

    const { nodes, links, graph, nodeId, updateSize, alluvialInstance } = useBase(alluvialProps, alluvialData);
    const {
      leftMostNodeLabelWidth,
      rightMostNodeLabelWidth,
      topMostNodeLabelExtraHeight,
      bottomMostNodeLabelExtraHeight,
      highlightedElements,
      highlightLinks,
      updateNodes,
      renderChart,
      maxDepth
    } = drawPlot(alluvialInstance, alluvialProps, nodes, links, chartContainer, nodeId,  graph);

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
    watch(graph, sankeyElements => renderChart({ nodes: sankeyElements.nodes, links: sankeyElements.links }));
    watch(leftMostNodeLabelWidth, width => alluvialInstance.value.leftExtent = width + nodeToLabelGap);
    watch(rightMostNodeLabelWidth, width => alluvialInstance.value.rightExtent = alluvialInstance.value.containerSize.width - (width + nodeToLabelGap));
    watch(bottomMostNodeLabelExtraHeight, height => alluvialInstance.value.bottomExtent = height);
    watch(topMostNodeLabelExtraHeight, height => alluvialInstance.value.topExtent = height);
    watch(alluvialInstance.value.containerSize, containerSize => alluvialInstance.value.rightExtent = containerSize.width - (rightMostNodeLabelWidth.value + nodeToLabelGap));

    return {
      updateSize,
      chartContainer,
      alluvialInstance,
      maxDepth,
      alluvialProps
    }
  }
});
</script>

<style lang="scss" scoped>
@use '~@/styles/_variables.scss' as *;

::v-deep .path-group {
  fill: none;

  &__link {
    stroke-opacity: 0.5;
    transition: stroke-opacity $chart-transition-time;

    &--out {
      stroke-opacity: 0.2;
    }

    @each $color, $map in $chart-colors {
      &--#{$color} {
        stroke: nth($map, 1);
      }
    }
  }
}
::v-deep .node {
  opacity: 1;
  transition: opacity $chart-transition-time;

  &--out {
    opacity: 0.5;
  }

  &__block {
    @each $color, $map in $chart-colors {
      &--#{$color} {
        $fill: nth($map, 1);
        fill: $fill;

        & + .node__label--color{
          fill: $fill;
        }
      }
    }
  }
  &__label {
    font-family: $adv-font-family;

    &--right {
      text-anchor: end;
    }

    &__title {
      font-size: $adv-text-font-size-small;
    }

    &__value {
      font-size: $adv-text-font-size-small;
      font-weight: $adv-text-font-weight-semi-bold;
    }
  }
}
</style>
