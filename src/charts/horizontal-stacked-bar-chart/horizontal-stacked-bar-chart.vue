<template>
  <div class="u-width-full u-height-full">
    <chart-container
      :margins="computedMargins"
      @resize="$determineWidthAndHeight"
    >
      <bar
        v-if="hasNegativeValues"
        :height="height"
        :width="xScale(0)"
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
import Bar from '@/core/bar.vue';
import BarsGroup from '@/core/bars-group.vue';
import ChartContainer from '@/core/chart-container.vue';
import BaseMixin from '@/mixins/base-mixin.js';
import BarMixin from '@/charts/bar-chart/mixins/bar-mixin';
import HorizontalMixin from '@/mixins/horizontal';
import NegativeValuesMixin from '@/mixins/negative-values';
import OptionsMixin from '@/mixins/options';
import Popover from '@/core/popover';
import { ORIENTATIONS } from '@/constants.js';
import { options } from './defaults';

const defaultBarHeight = 20; // 20px;
const defaultLeftMargin = 80; // 80px
const defaultRightMargin = 12; // 12px;

const getColor = (sourceBars, bar) =>
  sourceBars?.colors?.[bar.index] || `0${bar.index + 1}`;

export default {
  components: { Bar, BarsGroup, ChartContainer, Popover },
  mixins: [
    BaseMixin(ORIENTATIONS.HORIZONTAL),
    BarMixin(true),
    HorizontalMixin,
    NegativeValuesMixin,
    OptionsMixin(options)
  ],
  data: () => ({
    dataWithSuspension: null,
    animate: false
  }),
  computed: {
    computedMargins() {
      return {
        ...this.margins,
        left: defaultLeftMargin,
        right: defaultRightMargin,
      };
    },
  },
  beforeMount() {
    this.dataWithSuspension = new Array(this.paddedData.length);
    this.paddedData.forEach(({ values }, index) =>
      this.dataWithSuspension[index] = { values: new Array(values.length).fill(0) }
    );
  },
  async mounted() {
    const height = this.data.length * (defaultBarHeight * 1.5);
    this.$setHeight(height);
    await this.$nextTick();
    this.animate = true;
    this.dataWithSuspension = this.paddedData;
  },
  methods: {
    mapBelowZeroBars(bars, barsIndex, sourceBars) {
      return bars.reduce((acc, bar) => {
        const x = this.xScale(bar.value) + acc
          .map(({ width }) => width)
          .reduce((sum, curr) => sum + curr, 0);
        return [
          ...acc,
          {
            x,
            y: this.yScale(this.domain[barsIndex]),
            width: this.xScale(0) - this.xScale(bar.value),
            height: this.yScale.bandwidth(),
            fillClass: `adv-fill-color-${getColor(sourceBars, bar)}`,
          },
        ];
      }, []);
    },
    mapNonBelowZeroBars(bars, barsIndex, sourceBars) {
      return bars.reduce((acc, bar) => {
        const x = this.xScale(0) + acc
          .map(({ width }) => width)
          .reduce((sum, curr) => sum + curr, 0);
        return [
          ...acc,
          {
            x,
            y: this.yScale(this.domain[barsIndex]),
            width: this.xScale(bar.value) - this.xScale(0),
            height: this.yScale.bandwidth(),
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
