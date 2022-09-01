<template>
  <adv-chart-container
    :margins="allOptions.margins"
    @resize="updateSize"
  >
    <template v-if="allOptions.showAxes && xScale && yScale">
      <adv-axis
        type="x"
        :options="allOptions.xAxisOptions"
        :scale="xScale"
        :container-size="containerSize"
      />
      <adv-axis
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
      <adv-tooltip
        v-if="tooltipConfig.opened"
        v-bind="tooltipConfig"
        position="top"
        :title="boxGroups[hoveredIndex].key"
        :items="getTooltipItems(hoveredIndex)"
      >
        <slot
          name="tooltip"
          :index="hoveredIndex"
        />
      </adv-tooltip>
    </template>
  </adv-chart-container>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';

import AdvAxis from '@/core/adv-axis';
import BoxGroup from './components/box-group.vue';
import AdvChartContainer from '@/core/adv-chart-container';
import AdvTooltip from '@/core/adv-tooltip';

import { useBase } from '@/mixins/base';
import { useOptions, withOptions } from '@/mixins/options';
import { useTooltip } from '@/mixins/tooltip';
import { withData, useBoxComputations } from './mixins/box-composable';

import { options as defaultOptions } from './defaults';
export default defineComponent({
  components: { AdvAxis, AdvChartContainer, BoxGroup, AdvTooltip },
  props: {
    ...withOptions(),
    ...withData(),
  },
  setup(props, ctx) {
    const { options } = toRefs(props);

    // State from mixins

    const { containerSize, updateSize } = useBase(null, null);
    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();
    const { allOptions } = useOptions(options, defaultOptions);

    // Internal state

    const hoveredIndex = ref<number>(-1);
    const tooltipQuantile = ref(null);

    // Computed

    const {
      domain,
      boxPadding,
      xScale,
      yScale,
      quantiles,
      boxGroups,
      yAxisLabel,
    } = useBoxComputations(props.data, containerSize, allOptions);

    // Methods

    function getOverlayConfig(index: number) {
      return {
        transform: `translate(${
          xScale.value(domain.value[index]) - boxPadding.value / 2
        }, 0)`,
        width: xScale.value.step(),
        height: containerSize.height,
      };
    }

    function getTooltipItems(index) {
      const boxGroup = boxGroups.value[index];
      return Object.keys(boxGroup.quantile).map((label) => ({
        label,
        value: boxGroup.quantile[label],
        color: boxGroup.color,
      }));
    }

    function handleMouseover(quantile, index: number, event: MouseEvent) {
      hoveredIndex.value = index;
      tooltipQuantile.value = quantile;
      showTooltip(event.target as HTMLElement);
      ctx.emit('mouseover', index);
    }

    function handleMouseout() {
      hoveredIndex.value = -1;
      tooltipQuantile.value = null;
      hideTooltip();
      ctx.emit('mouseout');
    }

    return {
      allOptions,
      boxGroups,
      containerSize,
      getOverlayConfig,
      handleMouseout,
      handleMouseover,
      hoveredIndex,
      tooltipConfig,
      tooltipQuantile,
      quantiles,
      updateSize,
      xScale,
      yAxisLabel,
      yScale,
      getTooltipItems,
    };
  },
});
</script>
