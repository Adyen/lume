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
      <bar-group
        v-for="(value, index) in singleBarData"
        :key="`bar-group-${index}`"
        :bar="getBarConfig(value, index)"
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
import BarGroup from './bar-group.vue';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';

import { useBarMixin, withBarProps } from './mixins/bar-mixin';
import { useBase, withBase } from '@/mixins/base';
import { useConfig, withConfig } from '@/mixins/config';
import { useOptions, withOptions } from '@/mixins/options';
import { usePopover } from '@/mixins/popover';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';

import { NO_DATA } from '@/constants';
import { Data } from '@/types/dataset';

import { config as defaultConfig, options as defaultOptions } from './defaults';
import { useBarOverlay } from '@/charts/bar-chart/mixins/bar-overlay';

const fallbackFillClass = '01';

const singleBarDataValidator = (data: Data) => data.length === 1;

export default defineComponent({
  components: { Axis, Bar, BarGroup, ChartContainer, Popover },
  props: {
    ...withBase(singleBarDataValidator),
    ...withConfig(),
    ...withBarProps(),
    ...withOptions(),
  },
  setup(props, ctx) {
    // State from mixins
    const { data, labels } = toRefs(props);
    const {
      computedData,
      containerSize,
      updateSize,
      isHorizontal,
      domain,
    } = useBase(data, labels);
    const { hasNegativeValues } = checkNegativeValues(computedData.value);
    const { xScale, yScale, singleBarData } = useBarMixin(
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

    const yAxisLabel = computed(() => {
      if (allOptions.value.yAxisOptions?.withLabel === false) return;
      return (
        allOptions.value.yAxisOptions?.label || computedData.value[0].label
      );
    });

    // Methods

    function getBarConfig(value: number, index: number) {
      if (!yScale.value) return {};
      const yTranslation = value < 0 ? yScale.value(0) : yScale.value(value);
      const height =
        value < 0
          ? yScale.value(value) - yScale.value(0)
          : yScale.value(0) - yScale.value(value);
      return {
        transform: `translate(${xScale.value(index)}, ${yTranslation})`,
        width: xScale.value.bandwidth(),
        height,
        fillClass: `adv-fill-color-${computedData.value[0].color ||
          fallbackFillClass}`,
      };
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
      getPopoverItems,
      getBarConfig,
      getOverlayConfig,
      handleMouseout,
      handleMouseover,
      hasNegativeValues,
      hoveredIndex,
      negativeHeight,
      negativeTransform,
      popoverConfig,
      singleBarData,
      updateSize,
      yAxisLabel,
      xScale,
      yScale,
    };
  },
});
</script>
