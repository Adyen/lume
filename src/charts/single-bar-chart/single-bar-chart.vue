<template>
  <chart-container
    :margins="allOptions.margins"
    @resize="updateSize"
    @mouseleave="handleMouseleave"
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
      <adv-axis
        type="x"
        :options="allOptions.xAxisOptions"
        :scale="xScale"
        :container-size="containerSize"
        :hovered-index="orientation === 'vertical' ? hoveredIndex : -1"
        v-on="getAxisHandlers"
      />
      <adv-axis
        type="y"
        :options="allOptions.yAxisOptions"
        :scale="yScale"
        :title="yAxisTitle"
        :container-size="containerSize"
        :hovered-index="orientation === 'horizontal' ? hoveredIndex : -1"
        v-on="getAxisHandlers"
      />
    </template>

    <g v-if="xScale && yScale">
      <bars-group
        v-for="(value, index) in suspendedData"
        ref="barsRef"
        :key="`bar-group-${index}`"
        :bars="getBarConfig(value, index)"
        :overlay="getOverlayConfig(index)"
        :is-hovered="hoveredIndex === index"
        :animate="animate"
        @mouseover="handleMouseover(index)"
        @click="handleClick(index)"
      />
    </g>

    <template #extra>
      <tooltip
        v-if="allOptions.withTooltip && tooltipConfig.opened"
        v-bind="tooltipConfig"
        position="top"
        :title="labels[hoveredIndex]"
        :items="getTooltipItems(hoveredIndex)"
      >
        <slot
          name="tooltip"
          :index="hoveredIndex"
        />
      </tooltip>
    </template>
  </chart-container>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from '@vue/composition-api';

import AdvAxis from '@/core/axis';
import Bar from '@/core/bar';
import BarsGroup from '@/core/bars-group.vue';
import ChartContainer from '@/core/chart-container';
import Tooltip from '@/core/tooltip';

import { useBarMixin, withBarProps } from '@/charts/bar-chart/mixins/bar-mixin';
import { useBase, withBase } from '@/mixins/base';
import { useOptions, withOptions } from '@/mixins/options';
import { useTooltip } from '@/mixins/tooltip';
import { useAnimation } from '@/mixins/animation';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';

import { BAR_TYPES, NO_DATA, ORIENTATIONS } from '@/constants';
import { Data } from '@/types/dataset';

import { options as defaultOptions } from './defaults';
import { useBarOverlay } from '@/charts/bar-chart/mixins/bar-overlay';

const fallbackFillClass = '01';

const singleBarDataValidator = (data: Data) => data.length === 1;

export default defineComponent({
  components: { AdvAxis, Bar, BarsGroup, ChartContainer, Tooltip },
  props: {
    ...withBase(singleBarDataValidator),
    ...withBarProps(),
    ...withOptions(),
  },
  setup(props, ctx) {
    const barsRef = ref(null);

    // State from mixins
    const { data, labels, orientation, options } = toRefs(props);

    const { allOptions } = useOptions(
      options,
      defaultOptions[orientation.value || ORIENTATIONS.VERTICAL]
    );

    const { computedData, containerSize, updateSize, isHorizontal } = useBase(
      data,
      labels,
      orientation
    );
    const { hasNegativeValues } = checkNegativeValues(computedData);
    const { xScale, yScale, singleBarData, groupedData } = useBarMixin(
      BAR_TYPES.SINGLE,
      computedData.value,
      labels.value,
      containerSize,
      isHorizontal,
      allOptions.value
    );

    const { animate, suspendedData } = useAnimation(groupedData);

    const { negativeWidth, negativeHeight, negativeTransform } =
      useNegativeValues(containerSize, xScale, yScale, isHorizontal);
    const { getOverlayConfig } = useBarOverlay(
      isHorizontal,
      xScale,
      yScale,
      containerSize
    );
    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    // Internal state

    const hoveredIndex = ref<number>(-1);

    // Computed

    const yAxisTitle = computed(
      () => allOptions.value.yAxisOptions?.title || computedData.value[0].label
    );

    // Methods

    function getAxisHandlers() {
      return orientation.value === 'vertical' ? { 'tick-mouseover': handleMouseover } : {}
    }

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
          isFaded: hoveredIndex.value !== -1 && hoveredIndex.value !== index,
        },
      ];
    }

    function getTooltipItems(index: number) {
      return computedData.value.map(({ color, label, values }) => ({
        type: 'bar',
        color,
        label,
        value: values[index]?.value ?? NO_DATA,
      }));
    }

    function handleMouseover(index: number) {
      const element = barsRef.value[index].getTooltipAnchorPoint();
      hoveredIndex.value = index;
      showTooltip(element as HTMLElement);
      ctx.emit('mouseover', index);
    }

    function handleMouseleave() {
      hoveredIndex.value = -1;
      hideTooltip();
      ctx.emit('mouseout');
    }

    function handleClick(index) {
      ctx.emit('click', index);
    }

    return {
      allOptions,
      barsRef,
      containerSize,
      getTooltipItems,
      getBarConfig,
      getOverlayConfig,
      getAxisHandlers,
      handleMouseleave,
      handleMouseover,
      handleClick,
      orientation,
      hasNegativeValues,
      hoveredIndex,
      negativeWidth,
      negativeHeight,
      negativeTransform,
      tooltipConfig,
      singleBarData,
      updateSize,
      yAxisTitle,
      xScale,
      yScale,
      suspendedData,
      animate,
    };
  },
});
</script>
