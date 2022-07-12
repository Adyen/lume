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
      v-if="allOptions.showAxes !== false"
      name="axes"
      :x-scale="computedXScale"
      :y-scale="computedYScale"
      :container-size="containerSize"
      :options="allOptions"
    >
      <adv-axis
        type="x"
        :scale="computedXScale"
        :container-size="containerSize"
        :options="options.xAxisOptions"
      />
      <adv-axis
        type="y"
        :scale="computedYScale"
        :container-size="containerSize"
        :options="options.yAxisOptions"
      />
    </slot>

    <!-- Data groups -->
    <slot
      name="groups"
      :data="computedData"
      :labels="labels"
      :x-scale="computedXScale"
      :y-scale="computedYScale"
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
import { ScaleLinear } from 'd3-scale';

import AdvAxis from '@/core/axis';
import Bar from '@/core/bar';
import ChartContainer from '@/core/chart-container';
import Tooltip from '@/core/tooltip';

import { withBase, useBase } from '@/mixins/base';
import {
  getXByIndex,
  isScale,
  Scale,
  useBaseScales,
  withScales,
} from '@/mixins/scales';
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
    ...withScales(),
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

    const computedXScale = computed<Scale>(() => {
      if (!props.xScale) return xScale.value;
      return isScale(props.xScale)
        ? props.xScale
        : props.xScale?.(computedData.value, containerSize);
    });

    const computedYScale = computed<ScaleLinear<number, number>>(() => {
      if (!props.yScale) return yScale.value;
      return isScale(props.yScale)
        ? props.yScale
        : props.yScale?.(computedData.value, containerSize);
    });

    const { hasNegativeValues } = checkNegativeValues(computedData);
    const { negativeBarAttributes } = useNegativeValues(
      containerSize,
      xScale,
      yScale
    );

    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    function getTooltipAnchorAttributes(index: number) {
      // TODO: clean up this function, probsbly into a composable
      // Also needs to account for null values (line chart). currently falling back to 0
      const highestValue =
        computedData.value.reduce((max, point) =>
          max.values[index]?.value > point.values[index]?.value ? max : point
        ).values[index]?.value ?? Math.max(...computedYScale.value.domain());

      return {
        cx: getXByIndex(computedXScale.value, index),
        cy: computedYScale.value(highestValue),
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
      computedXScale,
      computedYScale,
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
    };
  },
});
</script>

<style lang="scss" scoped></style>
