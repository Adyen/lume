<template>
  <svg
    ref="svg"
    class="root"
  >
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
    <g :transform="barGroupsTransform">
      <bar-group
        v-for="(bar, index) in data"
        :key="`bar-group-${index}`"
        :bar="getBarConfig(bar, index)"
        :overlay="$getOverlayConfig(bar, index)"
        :is-hovered="hoveredIndex === index"
        @mouseover="$handleMouseover(index, $event)"
        @mouseout="$handleMouseout"
      />
    </g>
  </svg>
</template>

<script>
import BarMixin from '../core/bar-mixin.js';
import BarGroup from './bar-group.vue';

const fallbackFillColor = 'red';

export default {
  components: { BarGroup },
  mixins: [BarMixin],
  methods: {
    getBarConfig(bar, index) {
      return {
        transform: `translate(${this.xScale(index)}, ${this.yScale(bar)})`,
        width: this.xScale.bandwidth(),
        height: this.height - this.yScale(bar),
        fill: this.fill || fallbackFillColor
      };
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
