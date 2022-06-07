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
          :label="yAxisLabel"
          :options="allOptions.yAxisOptions"
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
      position="top"
    >
      <span class="u-font-weight-semi-bold">{{ labels[hoveredIndex] }}</span>: {{ data[hoveredIndex].values }}
    </popover>
  </div>
</template>

<script>
import { scaleBand } from 'd3-scale';

import Bar from '@/core/bar.vue';
import BarsGroup from '@/core/bars-group.vue';
import ChartContainer from '@/core/chart-container.vue';
import Popover from '@/core/popover';

import BarMixin from '@/charts/bar-chart/mixins/bar-mixin';
import BaseMixin from '@/mixins/base-mixin.js';
import ConfigMixin from '@/mixins/config';
import NegativeValuesMixin from '@/mixins/negative-values';
import OptionsMixin from '@/mixins/options';

import { config, options } from './defaults';

const getColor = (bars, barIndex) =>
  bars?.colors?.[barIndex] || `0${barIndex + 1}`;

export default {
  components: { Bar, BarsGroup, ChartContainer, Popover },
  mixins: [
    BaseMixin(),
    BarMixin(),
    ConfigMixin(config),
    NegativeValuesMixin,
    OptionsMixin(options),
  ],
  data: () => ({
    dataWithSuspension: null,
    animate: false
  }),
  computed: {
    xSubgroup() {
      return scaleBand()
        .domain(this.paddedDataAsArray[0].map((value, index) => index))
        .range([0, this.xScale.bandwidth()])
        .padding([0]);
    },
    yAxisLabel() {
      if (this.allOptions.yAxisOptions?.withLabel === false) return;
      return this.allOptions.yAxisOptions?.label || this.barsConfig?.legend;
    },
  },
  beforeMount() {
    this.dataWithSuspension = new Array(this.paddedData.length);
    this.paddedData.forEach(({ values }, index) =>
      this.dataWithSuspension[index] = { values: new Array(values.length).fill(0) }
    );
  },
  async mounted() {
    await this.$nextTick();
    this.animate = true;
    this.dataWithSuspension = this.paddedData;
  },
  methods: {
    getBarsConfig(bars, index) {
      return bars.values.map((value, barIndex) => {
        const y = value < 0 ? this.yScale(0) : this.yScale(value);
        const height =
          value < 0
            ? this.yScale(value) - this.yScale(0)
            : this.yScale(0) - this.yScale(value);
        return {
          x: this.xScale(this.domain[index]) + this.xSubgroup(barIndex),
          y,
          width: this.xSubgroup.bandwidth(),
          height,
          fillClass: `adv-fill-color-${getColor(bars, barIndex)}`,
        };
      });
    },
  },
};
</script>
