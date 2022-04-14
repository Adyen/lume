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
          fill-class="adv-fill-color-negative-values"
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
import BarsGroup from '../core/bars-group.vue';
import BarMixin from '../mixins/bar-mixin.js';
const getColor = (bars, barIndex) => bars?.colors?.[barIndex] || `0${barIndex + 1}`;

export default {
  components: { Bar, BarsGroup },
  mixins: [BarMixin],
  computed: {
    xSubgroup() {
      return d3.scaleBand()
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

<style>
.root {
  width: 100%;
  height: 100%;
}
</style>
