<template>
  <adv-chart-container
    :margins="allOptions.margins"
    data-j-adv-chart
    @resize="updateSize"
    @mouseleave="handleMouseleave"
  >
    <template #header>
      <div class="adv-chart__header">
        <!-- chart title -->
        <h1
          v-if="title"
          class="adv-chart__title adv-chart-title"
        >
          {{ title }}
        </h1>

        <!-- segmented control / filter -->
        <div class="adv-chart__controls">
          <slot name="controls" />
        </div>

        <!-- y axis title -->
        <h3
          v-if="showYAxisTitle"
          class="adv-chart__axis-title adv-axis-title"
        >
          {{ yAxisTitle }}
        </h3>

        <!-- chart legend -->
        <adv-chart-legend
          v-if="allOptions.withLegend !== false"
          class="adv-chart__legend"
          :data="computedData"
        />
      </div>
    </template>

    <template v-if="isReady">
      <!-- Negative values background -->
      <adv-bar
        v-if="hasNegativeValues"
        v-bind="negativeBarAttributes"
        class-list="adv-fill-color--negative"
        :transition="false"
        data-j-adv-chart__negative-values
      />

      <!-- Axes -->
      <slot
        v-if="allOptions.showAxes !== false"
        name="axes"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        :container-size="containerSize"
        :options="allOptions"
        :hovered-index="hoveredIndex"
      >
        <adv-axis
          type="x"
          :scale="computedXScale"
          :container-size="containerSize"
          :options="computedXAxisOptions"
          :hovered-index="hoveredIndex"
          data-j-adv-chart__x-axis
          @tick-mouseover="handleTickMouseover('x', $event)"
        />
        <adv-axis
          type="y"
          :scale="computedYScale"
          :container-size="containerSize"
          :options="computedYAxisOptions"
          :hovered-index="hoveredIndex"
          data-j-adv-chart__y-axis
          @tick-mouseover="handleTickMouseover('y', $event)"
        />
      </slot>

      <!-- Data groups -->
      <slot
        name="groups"
        :data="computedData"
        :labels="computedLabels"
        :orientation="orientation"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        :hovered-index="hoveredIndex"
        :container-size="containerSize"
        :transition="allOptions.withTransition !== false"
      />

      <!-- Overlay bars -->
      <adv-overlay-group
        v-if="allOptions.withHover !== false"
        :data="computedData"
        :orientation="orientation"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        data-j-adv-chart__overlay-group
        @mouseover="mouseOverHandler"
      />

      <!-- Tooltip anchor -->
      <g v-if="allOptions.withTooltip !== false">
        <circle
          v-for="(_, index) in getEmptyArrayFromData(computedData)"
          v-bind="getTooltipAnchorAttributes(index)"
          ref="tooltipAnchor"
          :key="`anchor-${index}`"
          :r="tooltipAnchorRadius"
          class="adv-fill-color--transparent"
        />
      </g>
    </template>

    <template #footer>
      <!-- x axis title -->
      <h3
        v-if="showXAxisTitle"
        class="adv-axis-title adv-axis-title--centered"
      >
        {{ xAxisTitle }}
      </h3>
    </template>

    <template #extra>
      <slot
        name="tooltip"
        v-bind="tooltipConfig"
        :data="computedData"
        :labels="computedLabels"
        :with-tooltip="allOptions.withTooltip !== false"
        :hovered-index="hoveredIndex"
        :options="allOptions.tooltipOptions"
      >
        <adv-tooltip
          v-if="allOptions.withTooltip !== false && tooltipConfig.opened"
          v-bind="tooltipConfig"
          :position="tooltipPosition"
          :title="computedLabels[hoveredIndex]"
          :items="getTooltipItems(hoveredIndex)"
          :options="allOptions.tooltipOptions"
          data-j-adv-chart__tooltip
        >
          <slot
            name="tooltip-content"
            :data="computedData"
            :labels="computedLabels"
            :hovered-index="hoveredIndex"
          />
        </adv-tooltip>
      </slot>
    </template>
  </adv-chart-container>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs } from 'vue';

import AdvAxis from '@/core/adv-axis';
import AdvBar from '@/core/adv-bar';
import AdvChartContainer from '@/core/adv-chart-container';
import AdvChartLegend from '@/core/adv-chart-legend';
import AdvOverlayGroup from '@/groups/adv-overlay-group';
import AdvTooltip from '@/core/adv-tooltip';

import { useBase } from '@/mixins/base';
import { withChartProps } from '@/mixins/props';
import { isScale, Scale, useBaseScales } from '@/mixins/scales';
import { ChartOptions, useOptions } from '@/mixins/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';
import { useTooltip, useTooltipAnchors } from '@/mixins/tooltip';

import { getEmptyArrayFromData } from '@/utils/helpers';
import { ORIENTATIONS, TOOLTIP_ANCHOR_RADIUS } from '@/constants';

export default defineComponent({
  components: {
    AdvAxis,
    AdvBar,
    AdvChartContainer,
    AdvChartLegend,
    AdvOverlayGroup,
    AdvTooltip,
  },
  props: {
    ...withChartProps(),
    chartType: {
      type: String,
      default: null,
    },
  },
  setup(props, ctx) {
    const { data, labels, options, orientation, chartType } = toRefs(props);

    const hoveredIndex = ref<number>(-1);
    const tooltipAnchor = ref<SVGCircleElement>(null);

    const { computedData, computedLabels, containerSize, updateSize } = useBase(
      data,
      labels,
      orientation
    );

    const { allOptions } = useOptions<ChartOptions>(options);

    const { xScale, yScale } = useBaseScales(
      computedData,
      computedLabels,
      containerSize,
      orientation,
      allOptions
    );

    const computedXScale = computed<Scale>(() => {
      if (!props.xScale) return xScale.value;
      return isScale(props.xScale)
        ? props.xScale
        : props.xScale?.(computedData.value, labels.value, containerSize);
    });

    const computedYScale = computed<Scale>(() => {
      if (!props.yScale) return yScale.value;
      return isScale(props.yScale)
        ? props.yScale
        : props.yScale?.(computedData.value, labels.value, containerSize);
    });

    const computedXAxisOptions = computed(() => ({
      ...allOptions.value.xAxisOptions,
      withHover: orientation.value === ORIENTATIONS.VERTICAL,
    }));

    const computedYAxisOptions = computed(() => ({
      ...allOptions.value.yAxisOptions,
      withHover: orientation.value === ORIENTATIONS.HORIZONTAL,
    }));

    const xAxisTitle = computed(() => {
      return allOptions.value.xAxisOptions?.title;
    });

    const yAxisTitle = computed(() => {
      return allOptions.value.yAxisOptions?.title;
    });

    const showXAxisTitle = computed(() => {
      return (
        allOptions.value.xAxisOptions?.withTitle !== false && xAxisTitle.value
      );
    });

    const showYAxisTitle = computed(() => {
      return (
        allOptions.value.yAxisOptions?.withTitle !== false && yAxisTitle.value
      );
    });

    const isReady = computed(() => {
      const conditions = [];

      const { noBaseScales } = allOptions.value;

      if (!noBaseScales) {
        conditions.push(() => !!(computedXScale.value && computedYScale.value));
      }

      return conditions.every((c) => c() === true);
    });

    const { hasNegativeValues } = checkNegativeValues(computedData);
    const { negativeBarAttributes } = useNegativeValues(
      containerSize,
      computedXScale,
      computedYScale,
      orientation
    );

    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    const { getTooltipAnchorAttributes, getTooltipItems } = useTooltipAnchors(
      computedData,
      computedXScale,
      computedYScale,
      orientation,
      chartType
    );

    const tooltipPosition = computed(
      () => allOptions.value.tooltipOptions?.position || 'top'
    );

    function mouseOverHandler(index: number) {
      // Update hoveredIndex
      allOptions.value.withHover !== false && (hoveredIndex.value = index);

      // Show/update tooltip
      allOptions.value.withTooltip !== false &&
        showTooltip(tooltipAnchor.value[index]);
    }

    function handleTickMouseover(type: 'x' | 'y', index: number) {
      // Only capture hover on the label axis
      if (
        (orientation.value === ORIENTATIONS.VERTICAL && type === 'x') ||
        (orientation.value === ORIENTATIONS.HORIZONTAL && type === 'y')
      ) {
        mouseOverHandler(index);
      }
    }

    function handleMouseleave() {
      hideTooltip();
      hoveredIndex.value = -1;
    }

    onMounted(() => {
      if (!ctx.slots.groups?.()) {
        console.error('"groups" `<slot>` must have content.');
      }
    });

    return {
      allOptions,
      computedData,
      computedLabels,
      computedXAxisOptions,
      computedXScale,
      computedYAxisOptions,
      computedYScale,
      containerSize,
      getEmptyArrayFromData: getEmptyArrayFromData,
      getTooltipAnchorAttributes,
      getTooltipItems,
      handleMouseleave,
      handleTickMouseover,
      hasNegativeValues,
      hoveredIndex,
      isReady,
      mouseOverHandler,
      negativeBarAttributes,
      showXAxisTitle,
      showYAxisTitle,
      tooltipAnchor,
      tooltipAnchorRadius: TOOLTIP_ANCHOR_RADIUS,
      tooltipConfig,
      tooltipPosition,
      updateSize,
      xAxisTitle,
      yAxisTitle,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
