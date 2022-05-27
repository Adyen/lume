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
      <bar-group
        v-for="(bar, index) in dataWithSuspension[0].values"
        :key="`bar-group-${index}`"
        :bar="getBarConfig(bar, index)"
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
      <span class="u-font-weight-semi-bold">{{ labels[hoveredIndex] }}</span>: {{ determinePopoverValue(data[0].values[hoveredIndex]) }}
    </popover>
  </div>
</template>

<script>
import BarGroup from '@/charts/bar-chart/bar-group.vue';
import Bar from '@/core/bar';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';
import BarMixin from '@/charts/bar-chart/mixins/bar-mixin';
import BarOverlay from '@/charts/bar-chart/mixins/bar-overlay';
import BaseMixin from '@/mixins/base-mixin';
import ConfigMixin from '@/mixins/config';
import HorizontalMixin from '@/mixins/horizontal';
import NegativeValues from '@/mixins/negative-values';
import OptionsMixin from '@/mixins/options';
import AnimationMixin from '@/mixins/animation';
import { ORIENTATIONS } from '@/constants';
import { config, options } from './defaults';

const fallbackFillClass = '01';
const defaultBarHeight = 20; // 20px
const defaultLeftMargin = 80; // 80px
const defaultRightMargin = 12; // 12px;

export default {
  components: { ChartContainer, Bar, BarGroup, Popover },
  mixins: [
    BaseMixin(ORIENTATIONS.HORIZONTAL),
    BarMixin(),
    BarOverlay,
    ConfigMixin(config),
    HorizontalMixin,
    NegativeValues,
    OptionsMixin(options),
    AnimationMixin()
  ],
  computed: {
    computedMargins() {
      return {
        ...this.margins,
        left: defaultLeftMargin,
        right: defaultRightMargin,
      };
    },
  },
  async mounted() {
    const height = this.data[0].values.length * (defaultBarHeight * 1.5);
    this.$setHeight(height);
  },
  methods: {
    getBarConfig(value, index) {
      const x = value >= 0 ? this.xScale(0) : this.xScale(value);
      const width =
        value < 0
          ? this.xScale(0) - this.xScale(value)
          : this.xScale(value) - this.xScale(0);
      return {
        y: this.yScale(this.domain[index]),
        x,
        width,
        height: this.yScale.bandwidth(),
        fillClass: `adv-fill-color-${
          this.paddedData[0].color || this.barsConfig.color || fallbackFillClass
        }`,
      };
    },
    determinePopoverValue(value) {
      return value ?? 'No data available';
    },
  },
};
</script>
