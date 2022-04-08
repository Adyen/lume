<template>
  <svg
      ref="svg"
      class="root"
  >
    <template v-f="showAxes">
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
    <g :transform="barGroupsTransform">
      <bars-group
          v-for="(bars, index) in data"
          :key="`bar-group-${index}`"
          :bars="getBarsConfig(bars, index)"
          :overlay="$getOverlayConfig(bars, index)"
          :is-hovered="hoveredIndex === index"
          @mouseover="$handleMouseover(index, $event)"
          @mouseout="$handleMouseout"
      />
    </g>
  </svg>
</template>

<script>
import BarsGroup from './bars-group.vue';
import BarMixin from '../core/bar-mixin.js';

const fillColors = ['red', 'green', 'blue', 'brown'];

export default {
  components: { BarsGroup },
  mixins: [BarMixin],
  methods: {
    getBarsConfig(bars, barsIndex) {
      return bars.reduce((acc, bar, barIndex) => {
        const offsetY = acc.map(({ height }) => height).reduce((sum, curr) => sum + curr, 0);
        return [...acc, {
          transform: `translate(${this.xScale(barsIndex)}, ${this.yScale(bar) - offsetY})`,
          width: this.xScale.bandwidth(),
          height: this.height - this.yScale(bar),
          fill: fillColors[barIndex % fillColors.length]
        }];
      }, []);
    },
  }
}
</script>

<style>
.root {
  width: 100%;
  height: 100%;
}
</style>
