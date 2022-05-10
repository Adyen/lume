<template>
  <div class="u-width-full u-height-full">
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
          type="x"
          :options="allOptions.xAxisOptions"
          :scale="xScale"
          :container-size="containerSize"
        />
        <axis
          type="y"
          :options="allOptions.yAxisOptions"
          :scale="yScale"
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
      <span class="u-font-weight-semi-bold">{{ labels[hoveredIndex] }}</span>
      : {{ determinePopoverValue(data[hoveredIndex].value) }}
    </popover>
  </div>
</template>

<script>
import BaseMixinFactory from '@/mixins/base-mixin';
import NegativeValuesMixin from '@/mixins/negative-values';
import OptionsMixin from '@/mixins/options';
import BarMixin from './mixins/bar-mixin';
import BarGroup from './bar-group.vue';
import Bar from '@/core/bar.vue';
import ChartContainer from "@/core/chart-container.vue";

const fallbackFillClass = '01';

export default {
  components: { ChartContainer, Bar, BarGroup },
  mixins: [BaseMixinFactory(), BarMixin(), NegativeValuesMixin, OptionsMixin({
    xAxisOptions: {},
    yAxisOptions: { gridLines: true },
  })],
  methods: {
    getBarConfig({ value, color }, index) {
      const yTranslation = value < 0 ? this.yScale(0) : this.yScale(value);
      const height = value < 0 ? this.yScale(value) - this.yScale(0) : this.yScale(0) - this.yScale(value);
      return {
        transform: `translate(${this.xScale(this.domain[index])}, ${yTranslation})`,
        width: this.xScale.bandwidth(),
        height,
        fillClass: `adv-fill-color-${color || this.barsConfig.color || fallbackFillClass}`,
      };
    },
    determinePopoverValue(value) {
      return value ?? 'No data available';
    }
  }
}
</script>
