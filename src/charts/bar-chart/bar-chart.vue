<template>
  <div class="u-width-full u-height-full">
    <chart-container
      :margins="computedConfig.margins"
      @resize="$determineWidthAndHeight"
    >
      <bar
        v-if="hasNegativeValues"
        :height="negativeHeight"
        :width="width"
        :transform="negativeTransform"
        fill-class="adv-fill-color-negative-values"
        :animate="false"
      />
      <template v-if="allOptions.showAxes">
        <axis
          type="x"
          :options="allOptions.xAxisOptions"
          :scale="xScale"
          :container-size="containerSize"
        />
        <axis
          type="y"
          :options="allOptions.yAxisOptions"
          :scale="yScale"
          :label="yAxisLabel"
          :container-size="containerSize"
        />
      </template>
      <bar-group
        v-for="(bar, index) in dataWithSuspension"
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
      position="top"
    >
      <span class="u-font-weight-semi-bold">{{ labels[hoveredIndex] }}</span>
      : {{ determinePopoverValue(data[0].values[hoveredIndex]) }}
    </popover>
  </div>
</template>

<script>
import BaseMixin from '@/mixins/base-mixin';
import ConfigMixin from '@/mixins/config';
import NegativeValuesMixin from '@/mixins/negative-values';
import OptionsMixin from '@/mixins/options';
import BarMixin from './mixins/bar-mixin';
import BarGroup from './bar-group.vue';
import Bar from '@/core/bar.vue';
import ChartContainer from '@/core/chart-container.vue';
import Popover from '@/core/popover';

import { config, options } from './defaults';

const fallbackFillClass = '01';

export default {
  components: { ChartContainer, Bar, BarGroup, Popover },
  mixins: [
    BaseMixin(),
    ConfigMixin(config),
    BarMixin(),
    NegativeValuesMixin,
    OptionsMixin(options),
  ],
  data: () => ({
    dataWithSuspension: null,
    animate: false
  }),
  computed: {
    yAxisLabel() {
      if (this.allOptions.yAxisOptions?.withLabel === false) return;
      return this.allOptions.yAxisOptions?.label || this.barsConfig?.legend;
    },
  },
  beforeMount() {
    this.dataWithSuspension = new Array(this.paddedData[0].values.length).fill(0);
  },
  async mounted() {
    await this.$nextTick();
    this.animate = true;
    this.dataWithSuspension = this.paddedData[0].values;
  },
  methods: {
    getBarConfig(value, index) {
      const y = value < 0 ? this.yScale(0) : this.yScale(value);
      const height =
        value < 0
          ? this.yScale(value) - this.yScale(0)
          : this.yScale(0) - this.yScale(value);
      return {
        x: this.xScale(this.domain[index]),
        y,
        width: this.xScale.bandwidth(),
        height,
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
