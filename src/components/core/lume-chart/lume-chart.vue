<template>
  <lume-chart-container
    :margins="allOptions.margins"
    :container-size="containerSize"
    :no-min-size="allOptions.noMinSize"
    :transparent-background="allOptions.transparentBackground"
    data-j-lume-chart
    @resize="updateSize"
    @mouseleave="handleMouseleave"
  >
    <template #header>
      <div class="lume-chart__header">
        <div class="lume-chart__header-section">
          <!-- chart title -->
          <h1
            v-if="title"
            class="lume-chart__title lume-chart-title"
          >
            {{ title }}
          </h1>

          <!-- segmented control / filter -->
          <div class="lume-chart__controls">
            <slot name="controls" />
          </div>
        </div>

        <div class="lume-chart__header-section">
          <!-- y axis title -->
          <h3
            v-if="showYAxisTitle"
            class="lume-chart__axis-title lume-axis-title"
          >
            {{ yAxisTitle }}
          </h3>

          <!-- chart legend -->
          <lume-chart-legend
            v-if="
              allOptions.withLegend !== false &&
                allOptions.legendPosition !== 'bottom'
            "
            class="lume-chart__legend"
            :data="internalData"
          />
        </div>
      </div>
    </template>

    <template v-if="isReady">
      <!-- Negative values background -->
      <lume-bar
        v-if="hasNegativeValues"
        v-bind="negativeBarAttributes"
        class-list="lume-fill--negative"
        :transition="false"
        data-j-lume-chart__negative-values
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
        <lume-axis
          type="x"
          :scale="computedXScale"
          :container-size="containerSize"
          :options="computedXAxisOptions"
          :hovered-index="hoveredIndex"
          data-j-lume-chart__x-axis
          @tick-mouseover="handleTickMouseover('x', $event)"
        />
        <lume-axis
          type="y"
          :scale="computedYScale"
          :container-size="containerSize"
          :options="computedYAxisOptions"
          :hovered-index="hoveredIndex"
          data-j-lume-chart__y-axis
          @tick-mouseover="handleTickMouseover('y', $event)"
        />
      </slot>

      <!-- Data groups -->
      <slot
        name="groups"
        :data="internalData"
        :labels="computedLabels"
        :options="allOptions"
        :orientation="orientation"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        :hovered-index="hoveredIndex"
        :container-size="containerSize"
        :transition="allOptions.withTransition !== false"
        :class-list="classList"
      />

      <!-- Overlay bars -->
      <lume-overlay-group
        v-if="allOptions.withHover !== false"
        :data="internalData"
        :orientation="orientation"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        data-j-lume-chart__overlay-group
        @mouseover="mouseOverHandler"
      />

      <!-- Tooltip anchor -->
      <g v-if="allOptions.withTooltip !== false">
        <circle
          v-for="(_, index) in getEmptyArrayFromData(internalData)"
          v-bind="getTooltipAnchorAttributes(index)"
          ref="tooltipAnchor"
          :key="`anchor-${index}`"
          :r="tooltipAnchorRadius"
          class="lume-fill--transparent"
        />
      </g>
    </template>

    <template #footer>
      <!-- x axis title -->
      <h3
        v-if="showXAxisTitle"
        class="lume-chart__axis-title lume-chart__axis-title--centered lume-axis-title"
      >
        {{ xAxisTitle }}
      </h3>

      <!-- bottom chart legend -->
      <lume-chart-legend
        v-if="
          allOptions.withLegend !== false &&
            allOptions.legendPosition === 'bottom'
        "
        class="lume-chart__legend lume-chart__legend--bottom"
        :data="internalData"
      />
    </template>

    <template #extra>
      <slot
        name="tooltip"
        v-bind="tooltipConfig"
        :data="internalData"
        :labels="computedLabels"
        :with-tooltip="allOptions.withTooltip !== false"
        :hovered-index="hoveredIndex"
        :options="allOptions.tooltipOptions"
      >
        <lume-tooltip
          v-if="allOptions.withTooltip !== false && tooltipConfig.opened"
          v-bind="tooltipConfig"
          :position="tooltipPosition"
          :title="computedLabels[hoveredIndex]"
          :items="getTooltipItems(hoveredIndex)"
          :options="allOptions.tooltipOptions"
          data-j-lume-chart__tooltip
        >
          <slot
            name="tooltip-content"
            :data="internalData"
            :labels="computedLabels"
            :hovered-index="hoveredIndex"
          />
        </lume-tooltip>
      </slot>
    </template>
  </lume-chart-container>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs } from 'vue';

import {
  LumeAxis,
  LumeBar,
  LumeChartContainer,
  LumeChartLegend,
  LumeTooltip,
} from '@/components/core';
import LumeOverlayGroup from '@/components/groups/lume-overlay-group';

import { useBase } from '@/composables/base';
import { withChartProps } from '@/composables/props';
import { isScale, Scale, useBaseScales } from '@/composables/scales';
import { ChartOptions, useOptions } from '@/composables/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/composables/negative-values';
import { useTooltip, useTooltipAnchors } from '@/composables/tooltip';

import { getEmptyArrayFromData } from '@/utils/helpers';
import { ORIENTATIONS, TOOLTIP_ANCHOR_RADIUS } from '@/constants';

export default defineComponent({
  components: {
    LumeAxis,
    LumeBar,
    LumeChartContainer,
    LumeChartLegend,
    LumeOverlayGroup,
    LumeTooltip,
  },
  props: {
    ...withChartProps(),
    chartType: {
      type: String,
      default: null,
    },
  },
  setup(props, ctx) {
    const { data, labels, color, options, orientation, chartType } =
      toRefs(props);

    const hoveredIndex = ref<number>(-1);
    const tooltipAnchor = ref<SVGCircleElement>(null);

    const { allOptions } = useOptions<ChartOptions>(options);

    const { internalData, computedLabels, containerSize, updateSize } = useBase(
      data,
      labels,
      color,
      allOptions,
      orientation
    );

    const { xScale, yScale } = useBaseScales(
      internalData,
      computedLabels,
      containerSize,
      orientation,
      allOptions
    );

    const computedXScale = computed<Scale>(() => {
      if (!props.xScale) return xScale.value;
      return isScale(props.xScale)
        ? props.xScale
        : props.xScale?.(internalData.value, labels.value, containerSize);
    });

    const computedYScale = computed<Scale>(() => {
      if (!props.yScale) return yScale.value;
      return isScale(props.yScale)
        ? props.yScale
        : props.yScale?.(internalData.value, labels.value, containerSize);
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

    const { hasNegativeValues } = checkNegativeValues(internalData);
    const { negativeBarAttributes } = useNegativeValues(
      containerSize,
      computedXScale,
      computedYScale,
      orientation
    );

    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    const { getTooltipAnchorAttributes, getTooltipItems } = useTooltipAnchors(
      internalData,
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
      internalData,
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
