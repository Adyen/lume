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
        <bar-group
            v-for="(bar, index) in paddedData"
            :key="`bar-group-${index}`"
            :bar="getBarConfig(bar, index)"
            :overlay="$getOverlayConfig(bar, index)"
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
      <span class="u-font-weight-semi-bold">{{ labels[hoveredIndex] }}</span>: {{ data[hoveredIndex] || 'No data available' }}
    </popover>
  </div>
</template>

<script>
import BarMixin from '../mixins/bar-mixin.js';
import BarGroup from './bar-group.vue';
import Bar from '../core/bar.vue';

const fallbackFillClass = 'adl-fill-color-01';

export default {
  components: { Bar, BarGroup },
  mixins: [BarMixin],
  methods: {
    getBarConfig(bar, index) {
      const yTranslation = bar < 0 ? this.yScale(0) : this.yScale(bar);
      const height = bar < 0 ?  this.yScale(bar) - this.yScale(0) : this.yScale(0) - this.yScale(bar);

      return {
        transform: `translate(${this.xScale(this.domain[index])}, ${yTranslation})`,
        width: this.xScale.bandwidth(),
        height,
        fillClass: this.fillClass || fallbackFillClass,
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
