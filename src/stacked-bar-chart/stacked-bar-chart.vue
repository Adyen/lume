<template>
  <div>
    <svg
        ref="svg"
        class="root"
    >
      <bar
          v-if="hasNegativeValues"
          :height="negativeHeight"
          :width="width"
          :transform="negativeTransform"
          fill-class="adl-fill-color-negative-values"
      />
      <g :transform="barGroupsTransform">
        <bars-group
            v-for="(bars, index) in paddedData"
            :key="`bar-group-${index}`"
            :bars="getBarsConfig(bars, index)"
            :overlay="$getOverlayConfig(bars, index)"
            :is-hovered="hoveredIndex === index"
            @mouseover="$handleMouseover(index, $event)"
            @mouseout="$handleMouseout"
        />
      </g>
      <template v-if="showAxes">
        <axis
            :scale="xScale"
            orientation="bottom"
            :transform.native="`translate(${margin}, ${height + margin})`"
        />
        <axis
            :scale="yScale"
            orientation="left"
            :transform.native="`translate(${margin}, ${margin})`"
        />
      </template>
    </svg>
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
import BarsGroup from './bars-group.vue';
import BarMixin from '../mixins/bar-mixin.js';
const getColor = (sourceBars, bar) => sourceBars?.colors?.[bar.index] || `0${bar.index + 1}`;

export default {
  components: { Bar, BarsGroup },
  mixins: [BarMixin],
  methods: {
    mapBelowZeroBars(bars, barsIndex, sourceBars) {
      return bars.reduce((acc, bar) => {
        const offsetY = acc.map(({ height }) => height).reduce((sum, curr) => sum + curr, 0);
        return [...acc, {
          transform: `translate(${this.xScale(this.domain[barsIndex])}, ${this.yScale(0) + offsetY})`,
          width: this.xScale.bandwidth(),
          height: this.yScale(bar.value) - this.yScale(0),
          fillClass: `adl-fill-color-${getColor(sourceBars, bar)}`
        }];
      }, []);
    },
    mapNonBelowZeroBars(bars, barsIndex, sourceBars) {
      return bars.reduce((acc, bar) => {
        const offsetY = acc.map(({ height }) => height).reduce((sum, curr) => sum + curr, 0);
        return [...acc, {
          transform: `translate(${this.xScale(this.domain[barsIndex])}, ${this.yScale(bar.value) - offsetY})`,
          width: this.xScale.bandwidth(),
          height: this.yScale(0) - this.yScale(bar.value),
          fillClass: `adl-fill-color-${getColor(sourceBars, bar)}`
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
    },
  }
};
</script>

<style>
.root {
  width: 100%;
  height: 100%;
}
</style>
