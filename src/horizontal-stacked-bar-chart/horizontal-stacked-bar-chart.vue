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
      <template v-if="showAxes">
        <axis
            :scale="xScale"
            type="x"
            :container-size="containerSize"
            :options="xAxisOptions"
        />
        <axis
            :scale="yScale"
            type="y"
            :container-size="containerSize"
        />
      </template>
      <bars-group
          v-for="(bars, index) in paddedData"
          :key="`bar-group-${index}`"
          :bars="getBarsConfig(bars, index)"
          :overlay="$getOverlayConfig(bars, index)"
          :is-hovered="hoveredIndex === index"
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
import Bar from '../core/bar.vue';
import BarsGroup from '../core/bars-group.vue';
import barMixinFactory from '../mixins/bar-mixin.js';
import ChartContainer from '../core/chart-container.vue';
const getColor = (sourceBars, bar) => sourceBars?.colors?.[bar.index] || `0${bar.index + 1}`;
import { orientations } from '../constants.js';

const defaultLeftMargin = 80; // 80px

export default {
  components: { Bar, BarsGroup, ChartContainer },
  mixins: [barMixinFactory(orientations.horizontal)],
  computed: {
    computedMargins() {
      return {
        ...this.margins,
        left: defaultLeftMargin
      }
    },
  },
  methods: {
    mapBelowZeroBars(bars, barsIndex, sourceBars) {
      return bars.reduce((acc, bar) => {
        const offsetX = acc.map(({ width }) => width).reduce((sum, curr) => sum + curr, 0);
        return [...acc, {
          transform: `translate(${this.xScale(bar.value) - offsetX}, ${this.yScale(this.domain[barsIndex])})`,
          width: this.xScale(0) - this.xScale(bar.value),
          height: this.yScale.bandwidth(),
          fillClass: `adv-fill-color-${getColor(sourceBars, bar)}`
        }];
      }, []);
    },
    mapNonBelowZeroBars(bars, barsIndex, sourceBars) {
      return bars.reduce((acc, bar) => {
        const offsetX = acc.map(({ width }) => width).reduce((sum, curr) => sum + curr, 0);
        return [...acc, {
          transform: `translate(${this.xScale(0) + offsetX}, ${this.yScale(this.domain[barsIndex])})`,
          width: this.xScale(bar.value) - this.xScale(0),
          height: this.yScale.bandwidth(),
          fillClass: `adv-fill-color-${getColor(sourceBars, bar)}`
        }];
      }, []);
    },
    getBarsConfig(bars, barsIndex) {
      // We need to keep track of the index so the colors will be applied consistently, regardless of values dipping below zero
      const valuesWithId = bars.values.map((value, index) => ({ value, index }));
      const belowZeroBars = valuesWithId.filter(bar => bar.value < 0);
      const nonBelowZeroBars = valuesWithId.filter(bar => bar.value >= 0);

      const result = [
        ...this.mapBelowZeroBars(belowZeroBars, barsIndex, bars),
        ...this.mapNonBelowZeroBars(nonBelowZeroBars, barsIndex, bars)
      ];

      return result;
    }
  }
};
</script>
