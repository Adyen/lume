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
        :scale="xScale"
        :container-size="containerSize"
        :options="allOptions.xAxisOptions"
        :hovered-index="hoveredIndex"
        @tick-mouseover="handleMouseover"
      />
      <adv-axis
        type="y"
        :scale="yScale"
        :container-size="containerSize"
        :options="allOptions.yAxisOptions"
        :title="yAxisTitle"
      />
    </template>

    <g v-if="xScale && yScale">
      <bars-group
        v-for="(datagroup, index) in suspendedData"
        ref="barsRef"
        :key="`bar-group-${index}`"
        :bars="getBarsConfig(datagroup, index)"
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
import { useOptions, withOptions } from '@/mixins/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';
import { useBarOverlay } from '@/charts/bar-chart/mixins/bar-overlay';
import { useBarProperties } from './mixins/bar-properties';
import { useBase, withBase } from '@/mixins/base';
import { useTooltip } from '@/mixins/tooltip';
import { useAnimation } from '@/mixins/animation';

import { BAR_TYPES, NO_DATA, ORIENTATIONS } from '@/constants';
import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvAxis, Bar, BarsGroup, ChartContainer, Tooltip },
  props: {
    ...withBase(),
    ...withBarProps(),
    ...withOptions(),
  },
  setup(props, ctx) {
    const barsRef = ref(null);

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

    const { negativeWidth, negativeHeight, negativeTransform } =
      useNegativeValues(containerSize, xScale, yScale, isHorizontal);

    const { getOverlayConfig } = useBarOverlay(
      isHorizontal,
      xScale,
      yScale,
      containerSize
    );

    const { animate, suspendedData } = useAnimation(groupedData);

    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    // Internal state

    const hoveredIndex = ref<number>(-1);

    // Computed

    const yAxisTitle = computed(
      () => allOptions.value.yAxisOptions?.title || computedData.value[0].label
    );

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
        ...mapNegativeBars(negativeValues, index, hoveredIndex.value),
        ...mapPositiveBars(positiveValues, index, hoveredIndex.value),
      ];

      return result;
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
      getBarsConfig,
      getOverlayConfig,
      getTooltipItems,
      groupedData,
      animate,
      suspendedData,
      handleMouseleave,
      handleMouseover,
      handleClick,
      hasNegativeValues,
      hoveredIndex,
      multiBarData,
      negativeWidth,
      negativeHeight,
      negativeTransform,
      tooltipConfig,
      updateSize,
      xScale,
      yAxisTitle,
      yScale,
    };
  },
});
</script>
