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
        v-for="(dataset, index) in stackedData"
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

import Axis from '@/core/axis';
import Bar from '@/core/bar';
import BarsGroup from '@/core/bars-group.vue';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';

import { useConfig, withConfig } from '@/mixins/config';
import { useOptions, withOptions } from '@/mixins/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';

import { NO_DATA } from '@/constants';
import { config as defaultConfig, options as defaultOptions } from './defaults';
import { useBase, withBase } from '@/mixins/base';
import { usePopover } from '@/mixins/popover';
import { useStackedBarMixin, withBarProps } from './mixins/stacked-bar-mixin';
import { useBarOverlay } from '@/charts/bar-chart/mixins/bar-overlay';

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
    const {
      computedData,
      containerSize,
      updateSize,
      isHorizontal,
      domain,
    } = useBase(data, labels);
    const { hasNegativeValues } = checkNegativeValues(computedData.value);
    const { xScale, yScale, multiBarData } = useStackedBarMixin(
      computedData.value,
      containerSize,
      props.padding,
      props.labels
    );
    const { negativeHeight, negativeTransform } = useNegativeValues(
      containerSize,
      yScale
    );
    const { getOverlayConfig } = useBarOverlay(
      isHorizontal,
      xScale,
      yScale,
      containerSize,
      domain
    );
    const { computedConfig } = useConfig(props.config, defaultConfig);
    const { allOptions } = useOptions(props.options, defaultOptions);
    const { popoverConfig, showPopover, hidePopover } = usePopover();

    // Internal state

    const hoveredIndex = ref<number>(-1);

    // Computed

    const stackedData = computed(() => {
      const result = [];
      multiBarData.value.forEach((dataset) => {
        dataset.values.forEach((value, i) => {
          if (!result[i]) result[i] = [value];
          else result[i].push(value);
        });
      });
      return result;
    });

    const yAxisLabel = computed(() => {
      if (allOptions.value.yAxisOptions?.withLabel === false) return;
      return (
        allOptions.value.yAxisOptions?.label || computedData.value[0].label
      );
    });

    // Methods

    function mapBelowZeroBars(bars, barsIndex: number) {
      return bars.reduce((acc, bar, index) => {
        const offsetY = acc
          .map(({ height }) => height)
          .reduce((sum, curr) => sum + curr, 0);
        const color = computedData.value[index].color;
        return [
          ...acc,
          {
            transform: `translate(${xScale.value(barsIndex)}, ${yScale.value(
              0
            ) + offsetY})`,
            width: xScale.value.bandwidth(),
            height: yScale.value(bar) - yScale.value(0),
            fillClass: `adv-fill-color-${color}`,
          },
        ];
      }, []);
    }

    function mapNonBelowZeroBars(bars, barsIndex: number) {
      return bars.reduce((acc, bar, index) => {
        const offsetY = acc
          .map(({ height }) => height)
          .reduce((sum, curr) => sum + curr, 0);
        const color = computedData.value[index].color;
        return [
          ...acc,
          {
            transform: `translate(${xScale.value(barsIndex)}, ${yScale.value(
              bar
            ) - offsetY})`,
            width: xScale.value.bandwidth(),
            height: yScale.value(0) - yScale.value(bar),
            fillClass: `adv-fill-color-${color}`,
          },
        ];
      }, []);
    }

    function getBarsConfig(dataset, datasetIndex: number) {
      // We need to keep track of the index so the colors will be applied consistently, regardless of values dipping below zero
      const belowZeroBars = dataset.filter((value) => value < 0);
      const nonBelowZeroBars = dataset.filter((value) => value >= 0);

      const result = [
        ...mapBelowZeroBars(belowZeroBars, datasetIndex),
        ...mapNonBelowZeroBars(nonBelowZeroBars, datasetIndex),
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
      getOverlayConfig,
      getPopoverItems,
      getBarsConfig,
      stackedData,
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
