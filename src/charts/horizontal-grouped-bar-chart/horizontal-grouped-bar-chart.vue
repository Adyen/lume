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
          :scale="xScale"
          type="x"
          :container-size="containerSize"
          :options="allOptions.xAxisOptions"
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
        :overlay="$getOverlayConfig(index)"
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
import { scaleBand } from 'd3-scale';
import Bar from '@/core/bar.vue';
import BarsGroup from '@/core/bars-group.vue';
import ChartContainer from '@/core/chart-container.vue';
import BaseMixin from '@/mixins/base-mixin.js';
import HorizontalMixin from '@/mixins/horizontal';
import OptionsMixin from '@/mixins/options';
import NegativeValuesMixin from '@/mixins/negative-values';
import Popover from '@/core/popover';
import { ORIENTATIONS } from '@/constants.js';
import { options } from './defaults';
import BarMixin from "@/charts/bar-chart/mixins/bar-mixin";

const getColor = (bars, barIndex) => bars?.colors?.[barIndex] || `0${barIndex + 1}`;
const defaultBarHeight = 20; // 12px
const defaultLeftMargin = 80; // 80px
const defaultRightMargin = 12; // 12px;

export default {
  components: { Bar, BarsGroup, ChartContainer, Popover },
  mixins: [
    BaseMixin(ORIENTATIONS.HORIZONTAL),
    BarMixin(),
    HorizontalMixin,
    NegativeValuesMixin,
    OptionsMixin(options)
  ],
  computed: {
    computedMargins() {
      return {
        ...this.margins,
        left: defaultLeftMargin,
        right: defaultRightMargin
      }
    },
    ySubgroup() {
      return scaleBand()
        .domain(this.paddedDataAsArray[0].map((value, index) => index))
        .range([0, this.yScale.bandwidth()])
        .padding([0])
    }
  },
  mounted() {
    const height = this.data.length * (defaultBarHeight * 1.5);
    this.$setHeight(height);
  },
  methods: {
    getBarsConfig(bars, index) {
      return bars.values.map((value, barIndex) => {
        const xTranslation = value >= 0 ? this.xScale(0) : this.xScale(value);
        const width = value < 0 ?  this.xScale(0) - this.xScale(value) : this.xScale(value) - this.xScale(0);
        return {
          transform: `translate(${xTranslation}, ${this.yScale(this.domain[index]) + this.ySubgroup(barIndex)})`,
          width,
          height: this.ySubgroup.bandwidth(),
          fillClass: `adv-fill-color-${getColor(bars, barIndex)}`
        };
      });
    },
  }
};
</script>
