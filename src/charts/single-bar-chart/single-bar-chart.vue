<template>
  <chart-container
    :margins="computedConfig.margins"
    @resize="updateSize"
  >
    <bar
      v-if="hasNegativeValues"
      :height="negativeHeight"
      :width="negativeWidth"
      :transform="negativeTransform"
      :animate="false"
      fill-class="adv-fill-color-negative-values"
    />

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
        :label="yAxisLabel"
        :container-size="containerSize"
      />
    </template>

    <template v-if="xScale && yScale">
      <bars-group
        v-for="(value, index) in suspendedData"
        :key="`bar-group-${index}`"
        :bars="getBarConfig(value, index)"
        :overlay="getOverlayConfig(index)"
        :is-hovered="hoveredIndex === index"
        :animate="animate"
        @mouseover="handleMouseover(index, $event)"
        @mouseout="handleMouseout"
        @click="handleClick(index)"
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
import { useBase, withBase } from '@/mixins/base';
import { useConfig, withConfig } from '@/mixins/config';
import { useOptions, withOptions } from '@/mixins/options';
import { usePopover } from '@/mixins/popover';
import { useAnimation } from '@/mixins/animation';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';

import { BAR_TYPES, NO_DATA, ORIENTATIONS } from '@/constants';
import { Data } from '@/types/dataset';

import { config as defaultConfig, options as defaultOptions } from './defaults';
import { useBarOverlay } from '@/charts/bar-chart/mixins/bar-overlay';

const fallbackFillClass = '01';

const singleBarDataValidator = (data: Data) => data.length === 1;

export default defineComponent({
  components: { Axis, Bar, BarsGroup, ChartContainer, Popover },
  props: {
    ...withBase(singleBarDataValidator),
    ...withConfig(),
    ...withBarProps(),
    ...withOptions(),
  },
  setup(props, ctx) {
    // State from mixins
    const { data, labels, orientation, options } = toRefs(props);

    const { computedConfig } = useConfig(props.config, defaultConfig);
    const { allOptions } = useOptions(
      options,
      defaultOptions[orientation.value || ORIENTATIONS.VERTICAL]
    );

    const { computedData, containerSize, updateSize, isHorizontal } = useBase(
      data,
      labels,
      orientation
    );
    const { hasNegativeValues } = checkNegativeValues(computedData.value);
    const { xScale, yScale, singleBarData, groupedData } = useBarMixin(
      BAR_TYPES.SINGLE,
      computedData.value,
      labels.value,
      containerSize,
      isHorizontal,
      allOptions.value
    );

    const { animate, suspendedData } = useAnimation(groupedData);

    const { negativeWidth, negativeHeight, negativeTransform } = useNegativeValues(
      containerSize,
      xScale,
      yScale,
      isHorizontal
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

    function getBarTransform(value: number, index: number) {
      let x: number, y: number;
      if (isHorizontal.value) {
        x = value >= 0 ? xScale.value(0) : xScale.value(value);
        y = yScale.value(labels.value[index]);
      } else {
        x = xScale.value(labels.value[index]);
        y = value < 0 ? yScale.value(0) : yScale.value(value);
      }
      return { x, y };
    }

    function getBarWidth(value: number) {
      if (isHorizontal.value) {
        return value < 0
          ? xScale.value(0) - xScale.value(value)
          : xScale.value(value) - xScale.value(0);
      }
      return xScale.value.bandwidth();
    }

    function getBarHeight(value: number) {
      if (isHorizontal.value) {
        return yScale.value.bandwidth();
      }
      return value < 0
        ? yScale.value(value) - yScale.value(0)
        : yScale.value(0) - yScale.value(value);
    }

    function getBarConfig(value: number, index: number) {
      if (!xScale.value || !yScale.value) return {};
      const color = computedData.value[0].color;
      const { x, y } = getBarTransform(value, index);
      return [
        {
          x,
          y,
          width: getBarWidth(value),
          height: getBarHeight(value),
          fillClass: `adv-fill-color-${color || fallbackFillClass}`,
        },
      ];
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

    function handleClick(index) {
      ctx.emit('click', index)
    }

    return {
      allOptions,
      computedConfig,
      containerSize,
      getPopoverItems,
      getBarConfig,
      getOverlayConfig,
      handleMouseout,
      handleMouseover,
      handleClick,
      hasNegativeValues,
      hoveredIndex,
      negativeWidth,
      negativeHeight,
      negativeTransform,
      popoverConfig,
      singleBarData,
      updateSize,
      yAxisLabel,
      xScale,
      yScale,
      suspendedData,
      animate
    };
  },
});
</script>
