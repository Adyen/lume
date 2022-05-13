<template>
  <div class="u-width-full u-height-full">
    <chart-container
      :margins="computedConfig.margins"
      @mouseleave.native="hoveredIndex = -1"
      @resize="$determineWidthAndHeight"
    >
      <!-- Negative values background -->
      <bar
        v-if="hasNegativeValues"
        :height="negativeHeight"
        :width="width"
        :transform="negativeTransform"
        fill-class="adv-fill-color-negative-values"
      />

      <!-- Axes -->
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

      <!-- Hover bar overlay -->
      <g class="line-chart__overlay">
        <bar
          v-for="(_, index) in data[0].values"
          ref="overlayBars"
          :key="`overlay-${index}`"
          :width="xScale.bandwidth()"
          :height="yScale(minValue)"
          :transform="getLineTranslation(index)"
          :fill-class="
            hoveredIndex === index
              ? 'adv-fill-color-overlay'
              : 'adv-fill-color-transparent'
          "
          :animate="false"
          @mouseover.native="hoveredIndex = index"
        />
      </g>

      <!-- Lines -->
      <line-group
        v-for="(group, index) in data"
        :key="`line-group-${index}`"
        v-bind="group"
        :x-scale="xScale"
        :y-scale="yScale"
        :hovered-index="hoveredIndex"
      />
    </chart-container>

    <!-- Chart popover -->
    <popover
      v-if="allOptions.withPopover && popoverConfig.opened"
      v-bind="popoverConfig"
      position="top"
      :title="labels[hoveredIndex]"
      :items="getPopoverItems(hoveredIndex)"
    >
      <slot
        name="popover"
        :index="hoveredIndex"
      />
    </popover>
  </div>
</template>

<script>
import Axis from '@/core/axis';
import Bar from '@/core/bar.vue';
import ChartContainer from '@/core/chart-container.vue';
import Popover from '@/core/popover';
import LineGroup from './components/line-group.vue';

import BaseMixin from '@/mixins/base-mixin';
import ConfigMixin from '@/mixins/config';
import LineScalesMixin from './mixins/line-scales';
import NegativeValuesMixin from '@/mixins/negative-values';
import OptionsMixin from '@/mixins/options';
import PopoverMixin from '@/mixins/popover';

import { config, options } from './defaults';
import { NO_DATA } from '@/constants';

export default {
  components: { Axis, Bar, ChartContainer, LineGroup, Popover },
  mixins: [
    BaseMixin(),
    ConfigMixin(config),
    LineScalesMixin(),
    NegativeValuesMixin,
    OptionsMixin(options),
    PopoverMixin(),
  ],
  data: () => ({
    hoveredIndex: -1,
  }),
  computed: {
    activeOverlayBar() {
      return this.$refs.overlayBars?.[this.hoveredIndex]?.$el;
    },
    yAxisLabel() {
      if (this.allOptions.yAxisOptions?.withLabel === false) return;
      return (
        this.allOptions.yAxisOptions?.label ||
        this.data.map((d) => d.label).join(', ')
      );
    },
  },
  watch: {
    hoveredIndex: function (index) {
      if (index > -1) this.$showPopover(this.activeOverlayBar);
      else this.$hidePopover();
    },
  },
  methods: {
    getLineTranslation(index) {
      return `translate(${this.xScale(this.xScale.domain()[index])}, 0)`;
    },
    getPopoverItems(index) {
      return this.data.map(({ color, label, values }) => ({
        type: 'line',
        color,
        label,
        value: values[index] ?? NO_DATA,
      }));
    },
  },
};
</script>
