<template>
  <div class="u-width-full u-height-full">
    <chart-container
      :margins="computedConfig.margins"
      @resize="updateSize"
      @mouseleave.native="hoveredIndex = -1"
    >
      <!-- Negative values background -->
      <bar
        v-if="hasNegativeValues"
        :height="negativeHeight"
        :width="containerSize.width"
        :transform="negativeTransform"
        fill-class="adv-fill-color-negative-values"
        :animate="false"
      />

      <!-- Axes -->
      <template v-if="allOptions.showAxes && xScale && yScale">
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

      <!-- Hover bar overlay -->
      <g
        v-if="xScale && yScale"
        class="line-chart__overlay"
      >
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
          @mouseover.native="hoveredIndex = index"
        />
      </g>

      <!-- Lines -->
      <template v-if="xScale && yScale">
        <line-group
          v-for="(group, index) in computedData"
          :key="`line-group-${index}`"
          v-bind="group"
          :x-scale="xScale"
          :y-scale="yScale"
          :hovered-index="hoveredIndex"
        />
      </template>
    </chart-container>
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

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/composition-api';

import Axis from '@/core/axis';
import Bar from '@/core/bar.vue';
import ChartContainer from '@/core/chart-container.vue';
import Popover from '@/core/popover';

import LineGroup from './components/line-group.vue';

import { useBase, withBase } from '@/mixins/base';
import { useConfig, withConfig } from '@/mixins/config';
import { useOptions, withOptions } from '@/mixins/options';
import { usePopover } from '@/mixins/popover';
import {
  useNegativeValues,
  checkNegativeValues,
} from '@/mixins/negative-values';
import { useLineScales } from './mixins/line-scales';

import { NO_DATA } from '@/constants';
import { config as defaultConfig, options as defaultOptions } from './defaults';

export default defineComponent({
  components: { Axis, Bar, ChartContainer, Popover, LineGroup },
  props: {
    ...withBase(),
    ...withConfig(),
    ...withOptions(),
    startOnZero: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    // State from mixins
    const { computedData, containerSize, updateSize } = useBase(
      props.data,
      props.labels
    );
    const { hasNegativeValues } = checkNegativeValues(computedData.value);
    const { xScale, yScale, minValue } = useLineScales(
      computedData.value,
      props.startOnZero,
      hasNegativeValues.value,
      containerSize,
      props.labels
    );
    const { negativeHeight, negativeTransform } = useNegativeValues(
      containerSize,
      yScale,
      false
    );
    const { computedConfig } = useConfig(props.config, defaultConfig);
    const { allOptions } = useOptions(props.options, defaultOptions);
    const { popoverConfig, showPopover, hidePopover } = usePopover();

    // Internal state

    const hoveredIndex = ref<number>(-1);
    const overlayBars = ref(null); // Template refs

    // Methods

    function getPopoverItems(index: number) {
      return computedData.value.map(({ color, label, values }) => ({
        type: 'line',
        color,
        label,
        value: values[index]?.value ?? NO_DATA,
      }));
    }

    function getLineTranslation(index: number) {
      return `translate(${xScale.value(xScale.value.domain()[index])}, 0)`;
    }

    // Watchers

    watch([hoveredIndex, overlayBars], function () {
      if (hoveredIndex.value > -1)
        showPopover(overlayBars.value?.[hoveredIndex.value].$el);
      else hidePopover();
    });

    return {
      allOptions,
      computedConfig,
      computedData,
      containerSize,
      getLineTranslation,
      getPopoverItems,
      hasNegativeValues,
      hoveredIndex,
      minValue,
      negativeHeight,
      negativeTransform,
      overlayBars,
      popoverConfig,
      updateSize,
      xScale,
      yScale,
    };
  },
});
</script>
