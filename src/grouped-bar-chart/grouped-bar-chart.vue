<template>
  <div>
    <chart-container
        :margins="margins"
        @resize="$determineWidthAndHeight"
    >
      <bar
          v-if="hasNegativeValues"
          :height="negativeHeight"
          :width="width"
          :transform="negativeTransform"
          fill-class="adv-fill-color-negative-values"
      />
      <template v-if="showAxes">
        <axis
            :scale="xScale"
            type="x"
            :container-size="containerSize"
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
import BarMixin from '../mixins/bar-mixin.js';
import ChartContainer from '../core/chart-container.vue';
import { scaleBand } from 'd3-scale';

const getColor = (bars, barIndex) => bars?.colors?.[barIndex] || `0${barIndex + 1}`;

export default {
  components: { Bar, BarsGroup, ChartContainer },
  mixins: [BarMixin],
  computed: {
    xSubgroup() {
      return scaleBand()
        .domain(this.paddedDataAsArray[0].map((value, index) => index))
        .range([0, this.xScale.bandwidth()])
        .padding([0.05])
    }
  },
  methods: {
    getBarsConfig(bars, index) {
      return bars.values.map((value, barIndex) => {
        const yTranslation = value < 0 ? this.yScale(0) : this.yScale(value);
        const height = value < 0 ? this.yScale(value) - this.yScale(0) : this.yScale(0) - this.yScale(value);
        return {
          transform: `translate(${this.xScale(this.domain[index]) + this.xSubgroup(barIndex)}, ${yTranslation})`,
          width: this.xSubgroup.bandwidth(),
          height,
          fillClass: `adv-fill-color-${getColor(bars, barIndex)}`
        };
      });
    },
  }
};
</script>
