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
        :label="yAxisLabel"
        :options="allOptions.yAxisOptions"
      />
    </template>

    <template v-if="xScale && yScale">
      <bars-group
        v-for="(dataset, index) in groupedData"
        :key="`bar-group-${index}`"
        :bars="getBarsConfig(dataset, index)"
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
import { scaleBand } from 'd3-scale';

import Axis from '@/core/axis';
import Bar from '@/core/bar';
import BarsGroup from '@/core/bars-group.vue';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';

import { config as defaultConfig, options as defaultOptions } from './defaults';
import { useBase, withBase } from '@/mixins/base';
import { useConfig, withConfig } from '@/mixins/config';
import { useOptions, withOptions } from '@/mixins/options';
import { useBarMixin, withBarProps } from '@/charts/bar-chart/mixins/bar-mixin';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';
import { usePopover } from '@/mixins/popover';
import { useBarOverlay } from '@/charts/bar-chart/mixins/bar-overlay';
import { BAR_TYPES, NO_DATA } from '@/constants';

export default defineComponent({
  components: { Axis, Bar, BarsGroup, ChartContainer, Popover },
  props: {
    ...withBase(),
    ...withConfig(),
    ...withBarProps(),
    ...withOptions(),
  },
  setup(props, ctx) {
    const { data, labels } = toRefs(props);

    const { computedConfig } = useConfig(props.config, defaultConfig);
    const { allOptions } = useOptions(props.options, defaultOptions);

    const {
      computedData,
      containerSize,
      updateSize,
      isHorizontal,
      domain,
    } = useBase(data, labels);
    const { hasNegativeValues } = checkNegativeValues(computedData.value);
    const { xScale, yScale, multiBarData, groupedData } = useBarMixin(
      BAR_TYPES.GROUPED,
      computedData.value,
      labels.value,
      containerSize,
      allOptions.value
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

    const xSubgroup = computed(() => {
      return scaleBand()
        .domain(multiBarData.value.map((_, index) => index))
        .range([0, xScale.value.bandwidth()])
        .padding([0]);
    });

    const yAxisLabel = computed(() => {
      if (allOptions.value.yAxisOptions?.withLabel === false) return;
      return (
        allOptions.value.yAxisOptions?.label || computedData.value[0].label
      );
    });

    // Methods

    function getBarsConfig(dataset: Array<number>, index) {
      return dataset.map((value, barIndex) => {
        const color = computedData.value[barIndex].color;
        const yTranslation = value < 0 ? yScale.value(0) : yScale.value(value);
        const height =
          value < 0
            ? yScale.value(value) - yScale.value(0)
            : yScale.value(0) - yScale.value(value);
        return {
          transform: `translate(${xScale.value(labels.value[index]) +
            xSubgroup.value(barIndex)}, ${yTranslation})`,
          width: xSubgroup.value.bandwidth(),
          height,
          fillClass: `adv-fill-color-${color}`,
        };
      });
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
      containerSize,
      hoveredIndex,
      multiBarData,
      xScale,
      getBarsConfig,
      getPopoverItems,
      updateSize,
      groupedData,
      handleMouseover,
      yAxisLabel,
      handleMouseout,
      yScale,
      hasNegativeValues,
      negativeHeight,
      negativeTransform,
      getOverlayConfig,
      computedConfig,
      allOptions,
      popoverConfig,
    };
  },
});
</script>
