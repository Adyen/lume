<template>
  <chart-container
    :margins="computedConfig.margins"
    @mouseleave.native="hoveredIndex = -1"
    @resize="updateSize"
  >
    <!-- Area -->
    <path
      v-if="allOptions.showArea"
      :class="[
        'sparkline-chart__area',
        `sparkline-chart__area--color-${areaColor || color}`,
      ]"
      :d="areaPathDefinition"
    />

    <!-- Negative area -->
    <bar
      v-if="hasNegativeValues"
      :height="negativeHeight"
      :width="containerSize.width"
      :transform="negativeTransform"
      :animate="false"
      fill-class="adv-fill-color-negative-values"
    />

    <!-- Ghost bars for popover target -->
    <g v-if="xScale && yScale">
      <bar
        v-for="(_, index) in values"
        ref="ghostBars"
        :key="`ghost-${index}`"
        :width="xScale(1)"
        :height="yScale(minValue)"
        :transform="ghostBarTransform(index)"
        fill-class="adv-fill-color-transparent"
        @mouseover.native="hoveredIndex = index"
      />
    </g>

    <!-- Line -->
    <path
      v-for="(d, i) in values"
      :key="i"
      :class="[
        'sparkline-chart__line',
        `sparkline-chart__line--color-${color}`,
        ...(isDashed(i) ? ['sparkline-chart__line--dashed'] : []),
      ]"
      :stroke-dasharray="((d) => (d == null ? '1.5%' : null))(d)"
      :d="linePathDefinition(i)"
    />

    <template #extra>
      <popover
        v-if="popoverConfig.opened"
        v-bind="popoverConfig"
        position="top"
        :title="labels ? labels[hoveredIndex] : null"
        :items="getPopoverItems(hoveredIndex)"
      >
        <slot
          name="popover"
          :index="hoveredIndex"
        />
      </popover>
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
import { line, area } from 'd3-shape';

import Bar from '@/core/bar';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';

import { useBase, withBase } from '@/mixins/base';
import { useConfig, withConfig } from '@/mixins/config';
import { useLineNullValues } from '@/mixins/line-null-values';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';
import { useOptions, withOptions } from '@/mixins/options';
import { usePopover } from '@/mixins/popover';
import { useSparklineScales } from './mixins/sparkline-scales';

import { NO_DATA } from '@/constants';
import { singleDatasetValidator } from '@/utils/helpers';
import { config as defaultConfig, options as defaultOptions } from './defaults';

export default defineComponent({
  components: { Bar, ChartContainer, Popover },
  props: {
    ...withBase(singleDatasetValidator),
    ...withConfig(),
    ...withOptions(),
  },
  setup(props) {
    // State from mixins
    const { data, labels } = toRefs(props);
    const { computedData, containerSize, updateSize } = useBase(data, labels);
    const { hasNegativeValues } = checkNegativeValues(computedData.value);
    const { xScale, yScale, minValue } = useSparklineScales(
      computedData.value,
      containerSize
    );
    const { negativeHeight, negativeTransform } = useNegativeValues(
      containerSize,
      yScale
    );
    const { allOptions } = useOptions(props.options, defaultOptions);
    const { computedConfig } = useConfig(props.config, defaultConfig);
    const { popoverConfig, showPopover, hidePopover } = usePopover();

    // Internal state

    const hoveredIndex = ref<number>(-1);
    const ghostBars = ref(null); // Template refs

    // Computed

    const color = computed(() => computedData.value[0].color);
    const areaColor = computed(
      () => computedData.value[0].areaColor || computedData.value[0].color
    );
    const values = computed(() => computedData.value[0].values);

    const { nullIntervals, getMidValue, isDashed } = useLineNullValues(
      values.value
    );

    const computedLineValues = computed(() => {
      return values.value.map((value, index) => {
        const nullInterval = nullIntervals.value.find((interval) =>
          interval.includes(index)
        );
        if (nullInterval) {
          let start = values.value[nullInterval[0] - 1].value;
          let end = values.value[nullInterval.at(-1) + 1].value;

          // If first/last value is `null`, use the first/last non-null value
          if (start == null) start = end;
          if (end == null) end = start;

          return getMidValue(
            start,
            end,
            nullInterval.length,
            nullInterval.indexOf(index)
          );
        }
        return value.value;
      });
    });

    const areaPathDefinition = computed(() => {
      if (!xScale.value || !yScale.value) return;
      return area()
        .x((_, i) => xScale.value(i))
        .y0(yScale.value(0))
        .y1((d) => yScale.value(d))(computedLineValues.value);
    });

    // Methods

    function getPopoverItems(index: number) {
      return computedData.value.map(({ color, label, values }) => ({
        type: 'line',
        color,
        label,
        value: values[index]?.value ?? NO_DATA,
      }));
    }

    function getLineValues(index: number) {
      // First value
      if (index === 0) return [];
      return [
        computedLineValues.value[index - 1],
        computedLineValues.value[index],
      ];
    }

    function linePathDefinition(index: number) {
      if (!xScale.value || !yScale.value) return;
      return line()
        .x((_, i) => xScale.value(index + i - 1))
        .y((d) => yScale.value(d))(getLineValues(index));
    }

    function ghostBarTransform(index: number) {
      return `translate(${xScale.value(index)}, 0)`;
    }

    // Watchers

    watch([hoveredIndex, ghostBars], function() {
      if (hoveredIndex.value > -1)
        showPopover(ghostBars.value?.[hoveredIndex.value].$el);
      else hidePopover();
    });

    return {
      allOptions,
      computedConfig,
      computedData,
      updateSize,
      hasNegativeValues,
      hoveredIndex,
      ghostBars,
      areaPathDefinition,
      color,
      linePathDefinition,
      ghostBarTransform,
      areaColor,
      negativeHeight,
      getPopoverItems,
      containerSize,
      minValue,
      isDashed,
      values,
      popoverConfig,
      negativeTransform,
      xScale,
      yScale,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

$line-stroke-width: 2px;
$line-stroke-hover-width: 4px;
$ghost-line-stroke-width: 8px;

.sparkline-chart {
  &__area {
    fill: $adv-color-grey-20;
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
      &--color-#{$color} {
        fill: nth($map, 3);
      }
    }
  }

  &__line {
    stroke-width: $line-stroke-width;
    stroke-linejoin: round;
    stroke-linecap: round;
    fill: none;
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
      &--color-#{$color} {
        stroke: nth($map, 1);
      }
    }

    &--dashed {
      stroke-dasharray: 2%;
    }
  }
}
</style>
