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
      <bar-group
          v-for="(bar, index) in paddedData"
          :key="`bar-group-${index}`"
          :bar="getBarConfig(bar, index)"
          :overlay="$getOverlayConfig(bar, index)"
          :is-hovered="hoveredIndex === index"
          @mouseover="$handleMouseover(index, $event)"
          @mouseout="$handleMouseout"
      />
    </chart-container>
    <popover
        v-if="popoverConfig.opened"
        v-bind="popoverConfig"
    >
      <span class="u-font-weight-semi-bold">{{ labels[hoveredIndex] }}</span>: {{ determinePopoverValue(data[hoveredIndex].value) }}
    </popover>
  </div>
</template>

<script>
import baseMixinFactory from '../mixins/base-mixin.js';
import BarGroup from '../bar-chart/bar-group.vue';
import Bar from '../core/bar.vue';
import ChartContainer from "../core/chart-container.vue";
import { orientations } from '../constants.js';

const fallbackFillClass = '01';
const defaultBarHeight = 20; // 20px
const defaultLeftMargin = 80; // 80px
const defaultRightMargin = 12; // 12px;

export default {
  components: { ChartContainer, Bar, BarGroup },
  mixins: [baseMixinFactory(orientations.horizontal)],
  computed: {
    computedMargins() {
      return {
        ...this.margins,
        left: defaultLeftMargin,
        right: defaultRightMargin
      }
    }
  },
  mounted() {
    const height = this.data.length * (defaultBarHeight * 1.5);
    this.$setHeight(height);
  },
  methods: {
    getBarConfig({ value, color }, index) {
      const xTranslation = value >= 0 ? this.xScale(0) : this.xScale(value);
      const width = value < 0 ?  this.xScale(0) - this.xScale(value) : this.xScale(value) - this.xScale(0);
      return {
        transform: `translate(${xTranslation}, ${this.yScale(this.domain[index])})`,
        width,
        height: this.yScale.bandwidth(),
        fillClass: `adv-fill-color-${color || this.barsConfig.color || fallbackFillClass}`,
      };
    },
    determinePopoverValue(value) {
      return value ?? 'No data available';
    }
  }
};
</script>
