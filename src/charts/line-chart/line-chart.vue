<template>
  <chart-container
    :margins="allOptions.margins"
    @resize="updateSize"
    @mouseleave="hoveredIndex = -1"
  >
    <!-- Negative values background -->
    <bar
      v-if="hasNegativeValues"
      :height="negativeHeight"
      :width="containerSize.width"
      :transform="negativeTransform"
      fill-class="adv-fill-color-negative-values"
      :animate="false"
    />

    <!-- Axes -->
    <template v-if="allOptions.showAxes && xScale && yScale">
      <adv-axis
        type="x"
        :options="allOptions.xAxisOptions"
        :scale="xScale"
        :container-size="containerSize"
        :hovered-index="hoveredIndex"
        @tick-mouseover="hoveredIndex = $event"
      />
      <adv-axis
        type="y"
        :options="allOptions.yAxisOptions"
        :scale="yScale"
        :title="yAxisTitle"
        :container-size="containerSize"
      />
    </template>

    <!-- Hover bar overlay -->
    <g
      v-if="xScale && yScale"
      class="line-chart__overlay"
    >
      <bar
        v-for="(_, index) in data[0].values"
        :key="`overlay-${index}`"
        :width="xScale.bandwidth()"
        :height="yScale(minValue)"
        :transform="getLineTranslation(index)"
        fill-class="adv-fill-color-transparent"
        @mouseover.native="hoveredIndex = index"
      />
      <path
        v-bind="overlayLineAttributes"
        class="line-chart__overlay-line"
      />
    </g>

    <!-- Lines -->
    <template v-if="xScale && yScale">
      <line-group
        v-for="(group, index) in computedData"
        :key="`line-group-${index}`"
        ref="lineGroups"
        v-bind="group"
        :x-scale="xScale"
        :y-scale="yScale"
        :hovered-index="hoveredIndex"
      />
    </template>

    <template #extra>
      <tooltip
        v-if="allOptions.withTooltip && tooltipConfig.opened"
        v-bind="tooltipConfig"
        position="top"
        :title="labels[hoveredIndex]"
        :items="getTooltipItems(hoveredIndex)"
      >
        <slot
          name="tooltip"
          :index="hoveredIndex"
        />
      </tooltip>
    </template>
  </chart-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  toRefs,
  watch,
} from '@vue/composition-api';

import AdvAxis from '@/core/axis';
import Bar from '@/core/bar';
import ChartContainer from '@/core/chart-container';
import Tooltip from '@/core/tooltip';

import LineGroup from './components/line-group.vue';

import { useBase, withBase } from '@/mixins/base';
import { useOptions, withOptions } from '@/mixins/options';
import { useTooltip } from '@/mixins/tooltip';
import {
  useNegativeValues,
  checkNegativeValues,
} from '@/mixins/negative-values';
import { useLineScales } from './mixins/line-scales';

import { NO_DATA } from '@/constants';
import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvAxis, Bar, ChartContainer, Tooltip, LineGroup },
  props: {
    ...withBase(),
    ...withOptions(),
    startOnZero: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    // Internal state

    const hoveredIndex = ref<number>(-1);
    const lineGroups = ref<Array<InstanceType<typeof LineGroup>>>(null); // Template ref

    // State from mixins

    const { data, labels, options, startOnZero } = toRefs(props);
    const { computedData, containerSize, updateSize, isHorizontal } = useBase(
      data,
      labels
    );
    const { hasNegativeValues } = checkNegativeValues(computedData);
    const { xScale, yScale, minValue } = useLineScales(
      computedData,
      startOnZero,
      hasNegativeValues,
      containerSize,
      labels
    );
    const { negativeHeight, negativeTransform } = useNegativeValues(
      containerSize,
      xScale,
      yScale,
      isHorizontal
    );
    const { allOptions } = useOptions(options, defaultOptions);
    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    // Computed

    const highestValue = computed(() =>
      Math.max(
        ...lineGroups.value.reduce(
          (acc, curr) => [...acc, curr.getPointValue(hoveredIndex.value)],
          []
        )
      )
    );

    const overlayLineAttributes = computed(() => {
      if (hoveredIndex.value === -1) return;

      const x =
        xScale.value(xScale.value.domain()[hoveredIndex.value || 0]) +
        xScale.value.bandwidth() / 2;

      return {
        d: `M ${x},${containerSize.height}
            V ${yScale.value(highestValue.value)}`, // Move to X index, Vertical line to the highest point
      };
    });

    const tooltipAnchorPoint = computed(() => {
      if (hoveredIndex.value === -1) return;

      // Get all points of the hovered index
      const pointsAtIndex = lineGroups.value.map((group) =>
        group.getPointByIndex(hoveredIndex.value)
      );

      // Return the highest point
      return pointsAtIndex.find((p) => p.value === highestValue.value);
    });

    const yAxisTitle = computed(
      () =>
        allOptions.value.yAxisOptions?.title ||
        computedData.value.map((d) => d.label).join(', ')
    );

    // Methods

    function getTooltipItems(index: number) {
      return computedData.value.map(({ color, label, values }) => ({
        type: 'line',
        color,
        label,
        value: values[index]?.value ?? NO_DATA,
      }));
    }

    function getLineTranslation(index: number) {
      return `translate(${xScale.value(xScale.value.domain()[index])}, 0)`;
    }

    // Watchers

    watch(hoveredIndex, function (newValue: number) {
      if (newValue === -1) hideTooltip();
      else showTooltip(tooltipAnchorPoint.value.$el);
    });

    return {
      allOptions,
      computedData,
      containerSize,
      getLineTranslation,
      getTooltipItems,
      hasNegativeValues,
      hoveredIndex,
      lineGroups,
      minValue,
      negativeHeight,
      negativeTransform,
      overlayLineAttributes,
      tooltipConfig,
      updateSize,
      xScale,
      yAxisTitle,
      yScale,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/_variables.scss' as *;
.line-chart {
  &__overlay-line {
    stroke: $adv-color-grey-30;
    stroke-width: 1px;
    stroke-dasharray: 2 2;

    transition: all $chart-transition-time ease-out;
  }
}
</style>
