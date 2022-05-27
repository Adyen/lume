<template>
  <div class="u-width-full u-height-full">
    <chart-container
      :margins="computedConfig.margins"
      @resize="$determineWidthAndHeight"
    >
      <bar
        v-if="hasNegativeValues"
        :height="negativeHeight"
        :width="width"
        :transform="negativeTransform"
        fill-class="adv-fill-color-negative-values"
      />
      <template v-if="allOptions.showAxes">
        <axis
          type="x"
          :scale="xScale"
          :container-size="containerSize"
          :options="allOptions.xAxisOptions"
        />
        <axis
          type="y"
          :scale="yScale"
          :container-size="containerSize"
          :options="allOptions.yAxisOptions"
          :label="yAxisLabel"
        />
      </template>
      <bars-group
        v-for="(bars, index) in dataWithSuspension"
        :key="`bar-group-${index}`"
        :bars="getBarsConfig(bars, index)"
        :overlay="$getOverlayConfig(index)"
        :is-hovered="hoveredIndex === index"
        :animate="animate"
        @mouseover="$handleMouseover(index, $event)"
        @mouseout="$handleMouseout"
      />
    </chart-container>
    <popover
      v-if="popoverConfig.opened"
      v-bind="popoverConfig"
    >
      <span class="u-font-weight-semi-bold">{{ labels[hoveredIndex] }}</span>: {{ data[hoveredIndex].values }}
    </popover>
  </div>
</template>

<script>
import Bar from '@/core/bar';
import BarsGroup from '@/core/bars-group.vue';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';
import AnimationMixin from '@/mixins/animation';
import BaseMixin from '@/mixins/base-mixin.js';
import ConfigMixin from '@/mixins/config';
import OptionsMixin from '@/mixins/options';
import BarMixin from '@/charts/bar-chart/mixins/bar-mixin';
import NegativeValues from '@/mixins/negative-values';

import { ORIENTATIONS } from '@/constants';
import { config, options } from './defaults';

const getColor = (sourceBars, bar) =>
  sourceBars?.colors?.[bar.index] || `0${bar.index + 1}`;

export default {
  components: { Bar, BarsGroup, ChartContainer, Popover },
  mixins: [
    BaseMixin(ORIENTATIONS.VERTICAL),
    BarMixin(true),
    ConfigMixin(config),
    NegativeValues,
    OptionsMixin(options),
    AnimationMixin()
  ],
  computed: {
    yAxisLabel() {
      if (this.allOptions.yAxisOptions?.withLabel === false) return;
      return this.allOptions.yAxisOptions?.label || this.barsConfig?.legend;
    },
  },
  methods: {
    mapBelowZeroBars(bars, barsIndex, sourceBars) {
      return bars.reduce((acc, bar) => {
        const offsetY = acc
          .map(({ height }) => height)
          .reduce((sum, curr) => sum + curr, 0);
        return [
          ...acc,
          {
            x: this.xScale(this.domain[barsIndex]),
            y: this.yScale(0) + offsetY,
            width: this.xScale.bandwidth(),
            height: this.yScale(bar.value) - this.yScale(0),
            fillClass: `adv-fill-color-${getColor(sourceBars, bar)}`,
          },
        ];
      }, []);
    },
    mapNonBelowZeroBars(bars, barsIndex, sourceBars) {
      return bars.reduce((acc, bar) => {
        const offsetY = acc
          .map(({ height }) => height)
          .reduce((sum, curr) => sum + curr, 0);
        return [
          ...acc,
          {
            x: this.xScale(this.domain[barsIndex]),
            y: this.yScale(bar.value) - offsetY,
            width: this.xScale.bandwidth(),
            height: this.yScale(0) - this.yScale(bar.value),
            fillClass: `adv-fill-color-${getColor(sourceBars, bar)}`,
          },
        ];
      }, []);
    },
    getBarsConfig(bars, barsIndex) {
      // We need to keep track of the index so the colors will be applied consistently, regardless of values dipping below zero
      const valuesWithId = bars.values.map((value, index) => ({
        value,
        index,
      }));
      const belowZeroBars = valuesWithId.filter((bar) => bar.value < 0);
      const nonBelowZeroBars = valuesWithId.filter((bar) => bar.value >= 0);

      const result = [
        ...this.mapBelowZeroBars(belowZeroBars, barsIndex, bars),
        ...this.mapNonBelowZeroBars(nonBelowZeroBars, barsIndex, bars),
      ];

      return result;
    },
  },
};
</script>
