<template>
  <chart-container
    :margins="computedConfig.margins"
    @resize="updateSize"
  >
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

    <box-group
      v-for="(boxGroup, index) in boxGroups"
      :key="boxGroup.key"
      :box-group="boxGroup"
      :overlay="getOverlayConfig(index)"
      :is-hovered="hoveredIndex === index"
      @mouseover="handleMouseover(boxGroup.quantile, index, $event)"
      @mouseout="handleMouseout"
    />

    <template #extra>
      <popover
        v-if="popoverConfig.opened"
        v-bind="popoverConfig"
        position="top"
        :title="boxGroups[hoveredIndex].key"
        :items="getPopoverItems()"
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
import {
  defineComponent,
  ref,
} from '@vue/composition-api';


import Axis from '@/core/axis';
import BoxGroup from './components/box-group.vue';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';

import { useBase } from '@/mixins/base';
import { useConfig, withConfig } from '@/mixins/config';
import { useOptions, withOptions } from '@/mixins/options';
import { usePopover } from '@/mixins/popover';
import { withData, useBoxComputations } from './mixins/box-composable';

import { config as defaultConfig, options as defaultOptions } from './defaults';
export default defineComponent({
  components: { Axis, ChartContainer, BoxGroup, Popover },
  props: {
    ...withConfig(),
    ...withOptions(),
    ...withData()
  },
  setup(props, ctx) {
    // State from mixins
    const { containerSize, updateSize } = useBase(null, null);
    const { popoverConfig, showPopover, hidePopover } = usePopover();
    const { computedConfig } = useConfig(props.config, defaultConfig);
    const { allOptions } = useOptions(props.options, defaultOptions);
    // Internal state

    const hoveredIndex = ref<number>(-1);
    const popoverQuantile = ref(null);

    // Computed
    const { domain, boxWidth, xScale, yScale, quantiles, boxGroups, yAxisLabel } = useBoxComputations(props.data, containerSize, allOptions);

    // Methods

    function getOverlayConfig(index: number) {
      return {
        transform: `translate(${xScale.value(domain.value[index]) -
          boxWidth.value / 2}, 0)`,
        width: xScale.value.step() - boxWidth.value / 4,
        height: containerSize.height,
      };
    }

    function getPopoverItems() {
      return Object.keys(popoverQuantile.value).map(label => ({
        label,
        value: popoverQuantile.value[label],
      }))
    }

    function handleMouseover(quantile, index: number, event: MouseEvent) {
      hoveredIndex.value = index;
      popoverQuantile.value = quantile;
      showPopover(event.target as HTMLElement);
      ctx.emit('mouseover', index);
    }

    function handleMouseout() {
      hoveredIndex.value = -1;
      popoverQuantile.value = null;
      hidePopover();
      ctx.emit('mouseout');
    }

    return {
      allOptions,
      boxGroups,
      computedConfig,
      containerSize,
      getOverlayConfig,
      handleMouseout,
      handleMouseover,
      hoveredIndex,
      popoverConfig,
      popoverQuantile,
      quantiles,
      updateSize,
      xScale,
      yAxisLabel,
      yScale,
      getPopoverItems
    };
  },
});
</script>
