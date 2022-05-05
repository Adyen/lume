<template>
  <div class="u-width-full u-height-full">
    <chart-container
      :margins="computedMargin"
      @mouseleave.native="hoveredIndex = -1"
      @resize="$determineWidthAndHeight"
    >
      <bar
        v-if="hasNegativeValues"
        :height="negativeHeight"
        :width="width"
        :transform="negativeTransform"
        fill-class="adv-fill-color-negative-values"
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
          :container-size="containerSize"
        />
      </template>

      <g class="line-chart__overlay">
        <bar
          v-for="(_, index) in data[0].values"
          ref="overlayBars"
          :key="`overlay-${index}`"
          :width="xScale.bandwidth()"
          :height="yScale(minValue)"
          :transform="getLineTranslation(index)"
          :fill-class="hoveredIndex === index ? 'adv-fill-color-overlay' : 'adv-fill-color-transparent'"
          :animate="false"
          @mouseover.native="hoveredIndex = index"
        />
      </g>

      <line-group
        v-for="(group, index) in data"
        :key="`line-group-${index}`"
        v-bind="group"
        :x-scale="xScale"
        :y-scale="yScale"
        :hovered-index="hoveredIndex"
      />
    </chart-container>

    <popover
      v-if="isPopoverOpened"
      position="top"
      :opened="isPopoverOpened"
      :target-element="activeOverlayBar"
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
import Axis from '@/core/axis.vue';
import Bar from '@/core/bar.vue';
import ChartContainer from '@/core/chart-container.vue';
import Popover from '@/core/popover';

import baseMixinFactory from '@/mixins/base-mixin';
import OptionsMixin from '@/mixins/options';

import LineGroup from './components/line-group.vue';

import config from './config';
import { NO_DATA } from '@/constants';

export default {
    components: { Axis, Bar, ChartContainer, LineGroup, Popover },
    mixins: [baseMixinFactory(), OptionsMixin({
        showAxes: true,
        xAxisOptions: {},
        yAxisOptions: { gridLines: true },
    })],
    data: () => ({
        hoveredIndex: -1,
    }),
    computed: {
        computedMargin() {
            return {
                ...this.margins,
                ...config.margins,
            }
        },
        activeOverlayBar() {
            return this.$refs.overlayBars?.[this.hoveredIndex]?.$el;
        },
        isPopoverOpened() {
            return this.hoveredIndex >= 0;
        }
    },
    methods: {
        getLineTranslation(index) {
            return `translate(${this.xScale(this.domain[index])}, 0)`;
        },
        getPopoverItems(index) {
            return this.data.map(({ color, legend, values }) => ({
                type: 'line',
                color,
                legend,
                value: values[index] ?? NO_DATA
            }));
        }
    }
}
</script>
