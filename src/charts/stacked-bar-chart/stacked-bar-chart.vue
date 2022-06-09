<template>
  <chart-container
    :margins="computedConfig.margins"
    @resize="updateSize"
  >
    <bar
      v-if="hasNegativeValues"
      :height="negativeHeight"
      :width="containerSize.width"
      :transform="negativeTransform"
      :animate="false"
      fill-class="adv-fill-color-negative-values"
    />

    <template v-if="allOptions.showAxes && xScale && yScale">
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
        :label="yAxisLabel"
      />
    </template>

    <template v-if="xScale && yScale">
      <bars-group
        v-for="(datagroup, index) in groupedData"
        :key="`bar-group-${index}`"
        :bars="getBarsConfig(datagroup, index)"
        :overlay="getOverlayConfig(index)"
        :is-hovered="hoveredIndex === index"
        @mouseover="handleMouseover(index, $event)"
        @mouseout="handleMouseout"
      />
    </template>

    <template #extra>
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
    </template>
  </chart-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from '@vue/composition-api';

import Axis from '@/core/axis';
import Bar from '@/core/bar';
import BarsGroup from '@/core/bars-group.vue';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';

import { useBarMixin, withBarProps } from '@/charts/bar-chart/mixins/bar-mixin';
import { useConfig, withConfig } from '@/mixins/config';
import { useOptions, withOptions } from '@/mixins/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';
import { useBarOverlay } from '@/charts/bar-chart/mixins/bar-overlay';
import { useBarProperties } from './mixins/bar-properties';
import { useBase, withBase } from '@/mixins/base';
import { usePopover } from '@/mixins/popover';

import { BAR_TYPES, NO_DATA, ORIENTATIONS } from '@/constants';
import { config as defaultConfig, options as defaultOptions } from './defaults';

export default defineComponent({
  components: { Axis, Bar, BarsGroup, ChartContainer, Popover },
  props: {
    ...withBase(),
    ...withConfig(),
    ...withBarProps(),
    ...withOptions(),
  },
  setup(props, ctx) {
    const { data, labels, orientation } = toRefs(props);

    const { computedConfig } = useConfig(props.config, defaultConfig);
    const { allOptions } = useOptions(
      props.options,
      defaultOptions[orientation.value || ORIENTATIONS.VERTICAL]
    );

    const { computedData, containerSize, updateSize, isHorizontal } = useBase(
      data,
      labels,
      orientation
    );

    const { hasNegativeValues } = checkNegativeValues(computedData.value);

    const { xScale, yScale, multiBarData, groupedData } = useBarMixin(
      BAR_TYPES.STACKED,
      computedData.value,
      labels.value,
      containerSize,
      isHorizontal,
      allOptions.value
    );

    const { mapPositiveBars, mapNegativeBars } = useBarProperties(
      multiBarData,
      isHorizontal,
      xScale,
      yScale
    );

    const { negativeHeight, negativeTransform } = useNegativeValues(
      containerSize,
      yScale
    );

    const { getOverlayConfig } = useBarOverlay(
      isHorizontal,
      xScale,
      yScale,
      containerSize
    );

    const { popoverConfig, showPopover, hidePopover } = usePopover();

    // Internal state

    const hoveredIndex = ref<number>(-1);

    // Computed

    const yAxisLabel = computed(() => {
      if (allOptions.value.yAxisOptions?.withLabel === false) return;
      return (
        allOptions.value.yAxisOptions?.label || computedData.value[0].label
      );
    });

    // Methods

    function getBarsConfig(dataGroup: Array<number>, index: number) {
      // We need to keep track of the index so the colors will be applied consistently, regardless of values dipping below zero
      const negativeValues = dataGroup.map((value) =>
        value < 0 ? value : null
      );
      const positiveValues = dataGroup.map((value) =>
        value >= 0 ? value : null
      );

      const result = [
        ...mapNegativeBars(negativeValues, index),
        ...mapPositiveBars(positiveValues, index),
      ];

      return result;
    }

    function getPopoverItems(index: number) {
      return computedData.value.map(({ color, label, values }) => ({
        type: 'bar',
        color,
        label,
        value: values[index]?.value ?? NO_DATA,
      }));
    }

    function handleMouseover(index: number, event: MouseEvent) {
      hoveredIndex.value = index;
      showPopover(event.target as HTMLElement);
      ctx.emit('mouseover', index);
    }

    function handleMouseout() {
      hoveredIndex.value = -1;
      hidePopover();
      ctx.emit('mouseout');
    }

    return {
      allOptions,
      computedConfig,
      containerSize,
      getBarsConfig,
      getOverlayConfig,
      getPopoverItems,
      groupedData,
      handleMouseout,
      handleMouseover,
      hasNegativeValues,
      hoveredIndex,
      multiBarData,
      negativeHeight,
      negativeTransform,
      popoverConfig,
      updateSize,
      xScale,
      yAxisLabel,
      yScale,
    };
  },
});
</script>
