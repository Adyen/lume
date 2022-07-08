<template>
  <chart-container
    :margins="allOptions.margins"
    @resize="updateSize"
    @mouseleave="handleMouseleave"
  >
    <!-- Negative values background -->
    <bar
      v-if="hasNegativeValues"
      v-bind="negativeBarAttributes"
      fill-class="adv-fill-color-negative-values"
      :animate="false"
    />

    <!-- Axes -->
    <slot
      name="axes"
      :x-scale="xScale"
      :y-scale="yScale"
      :container-size="containerSize"
      :options="allOptions"
    >
      <adv-axis
        type="x"
        :scale="xScale"
        :container-size="containerSize"
        :options="options.xAxisOptions"
      />
      <adv-axis
        type="y"
        :scale="yScale"
        :container-size="containerSize"
        :options="options.yAxisOptions"
      />
    </slot>

    <!-- Data groups -->
    <slot
      name="groups"
      :data="computedData"
      :labels="labels"
      :x-scale="xScale"
      :y-scale="yScale"
      :hovered-index="hoveredIndex"
      :on-mouseover-fn="mouseOverHandler"
    />

    <!-- Tooltip anchor -->
    <g v-if="allOptions.withTooltip !== false">
      <circle
        v-for="(_, index) in computedData[0].values"
        v-bind="getTooltipAnchorAttributes(index)"
        ref="tooltipAnchor"
        :key="`anchor-${index}`"
      />
    </g>

    <template #extra>
      <slot name="tooltip">
        <tooltip
          v-if="allOptions.withTooltip !== false && tooltipConfig.opened"
          v-bind="tooltipConfig"
          position="top"
          :title="labels[hoveredIndex]"
          :items="getTooltipItems(hoveredIndex)"
        />
      </slot>
    </template>
  </chart-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  toRefs,
} from '@vue/composition-api';

import AdvAxis from '@/core/axis';
import Bar from '@/core/bar';
import ChartContainer from '@/core/chart-container';
import Tooltip from '@/core/tooltip';

import { withBase, useBase } from '@/mixins/base';
import { useBaseScales } from '@/mixins/scales';
import { withOptions, useOptions } from '@/mixins/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';
import { useTooltip } from '@/mixins/tooltip';

import { NO_DATA } from '@/constants';

export default defineComponent({
  components: { AdvAxis, Bar, ChartContainer, Tooltip },
  props: {
    ...withBase(),
    ...withOptions(),
  },
  setup(props, ctx) {
    const { data, labels, options } = toRefs(props);

    const hoveredIndex = ref<number>(-1);
    const tooltipAnchor = ref<SVGCircleElement>(null);

    const { computedData, containerSize, updateSize } = useBase(data, labels);

    const { xScale, yScale } = useBaseScales(
      computedData,
      labels,
      containerSize
    );

    const { allOptions } = useOptions(options);

    const { hasNegativeValues } = checkNegativeValues(computedData);
    const { negativeBarAttributes } = useNegativeValues(
      containerSize,
      xScale,
      yScale
    );

    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    function getTooltipAnchorAttributes(index: number) {
      // TODO: clean up this function, probsbly into a composable
      const highestValue = computedData.value.reduce((max, point) =>
        max.values[index]?.value > point.values[index]?.value ? max : point
      ).values[index].value;
      return {
        cx:
          xScale.value.bandwidth() / 2 +
          xScale.value(xScale.value.domain()[index]),
        cy: yScale.value(highestValue),
      };
    }

    function getTooltipItems(index: number) {
      return computedData.value.map(({ color, label, values, type }) => ({
        type: type || 'line',
        color,
        label,
        value: values[index]?.value ?? NO_DATA,
      }));
    }

    function handleMouseleave() {
      hoveredIndex.value = -1;
      hideTooltip();
    }

    const mouseOverHandler = computed(() => {
      const handler = (index: number) => {
        // Update hoveredIndex
        allOptions.value.withHover !== false && (hoveredIndex.value = index);

        // Show/update tooltip
        allOptions.value.withTooltip !== false &&
          showTooltip(tooltipAnchor.value[index]);
      };

      return handler;
    });

    onMounted(() => {
      if (!ctx.slots.groups?.()) {
        console.error('"groups" `<slot>` must have content.');
      }
    });

    return {
      allOptions,
      computedData,
      containerSize,
      getTooltipAnchorAttributes,
      getTooltipItems,
      handleMouseleave,
      hasNegativeValues,
      hoveredIndex,
      mouseOverHandler,
      negativeBarAttributes,
      tooltipAnchor,
      tooltipConfig,
      updateSize,
      xScale,
      yScale,
    };
  },
});
</script>

<style lang="scss" scoped></style>
