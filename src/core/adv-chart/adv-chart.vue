<template>
  <adv-chart-container
    :margins="allOptions.margins"
    :container-size="containerSize"
    data-j-adv-chart
    @resize="updateSize"
    @mouseleave="handleMouseleave"
  >
    <template #header>
      <!-- chart title -->
      <h1
        v-if="title"
        class="adv-chart-title"
      >
        {{ title }}
      </h1>

      <!-- segmented control / filter -->

      <div class="adv-chart__header">
        <!-- y axis title -->
        <h3
          v-if="showYAxisTitle"
          class="adv-axis-title"
        >
          {{ yAxisTitle }}
        </h3>

        <!-- chart legend -->
        <adv-chart-legend
          v-if="allOptions.withLegend !== false"
          :data="computedData"
        />
      </div>
    </template>

    <template v-if="computedXScale && computedYScale">
      <!-- Negative values background -->
      <adv-bar
        v-if="hasNegativeValues"
        v-bind="negativeBarAttributes"
        fill-class="adv-fill-color--negative"
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
          @tick-mouseover="handleTickMouseover('x', $event)"
        />
        <adv-axis
          type="y"
          :scale="computedYScale"
          :container-size="containerSize"
          :options="computedYAxisOptions"
          :hovered-index="hoveredIndex"
          @tick-mouseover="handleTickMouseover('y', $event)"
        />
      </slot>

      <!-- Overlay bars -->
      <adv-overlay-group
        v-if="allOptions.withHover !== false"
        :data="computedData"
        :orientation="orientation"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        @mouseover="mouseOverHandler"
      />

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
      />

      <!-- Tooltip anchor -->
      <g
        v-if="allOptions.withTooltip !== false"
        data-j-adv-chart__tooltip
      >
        <circle
          v-for="(_, index) in computedData[0].values"
          v-bind="getTooltipAnchorAttributes(index)"
          ref="tooltipAnchor"
          :key="`anchor-${index}`"
        />
      </g>

      <!-- Tooltip inline -->
      <g
        v-if="allOptions.showTooltipContentInline"
        data-j-adv-chart__tooltip-content-inline
      >
        <template v-for="(data, index) in computedData[0].values">
          <text
            v-if="hoveredIndex === index"
            v-bind="getInlineTooltipCoordinates(index)"
            :key="`tooltip-content-inline-${index}`"
            class="adv-chart__tooltip-inline-text"
            v-text="data.value || noData"
          />
        </template>
      </g>
    </template>

    <template v-if="!computedLabels">
      <slot
        name="groups"
        :data="computedData"
        :orientation="orientation"
        :hovered-index="hoveredIndex"
        :container-size="containerSize"
      />
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
          v-if="allOptions.withTooltip !== false && tooltipConfig.opened && !allOptions.showTooltipContentInline"
          v-bind="tooltipConfig"
          :position="tooltipPosition"
          :title="computedLabels[hoveredIndex]"
          :items="getTooltipItems(hoveredIndex)"
          :options="allOptions.tooltipOptions"
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
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  toRefs,
} from '@vue/composition-api';

import AdvAxis from '@/core/adv-axis';
import AdvBar from '@/core/adv-bar';
import AdvChartContainer from '@/core/adv-chart-container';
import AdvChartLegend from '@/core/adv-chart-legend';
import AdvOverlayGroup from '@/core/adv-overlay-group';
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

import { NO_DATA, ORIENTATIONS } from '@/constants';

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
    isLabelsRequired: {
      type: Boolean,
      default: true
    }
  },
  setup(props, ctx) {
    const { data, labels, options, orientation, chartType } = toRefs(props);

    const hoveredIndex = ref<number>(-1);
    const tooltipAnchor = ref<SVGCircleElement>(null);

    const computedLabels = computed(() => {
      if (props.isLabelsRequired) return props.labels;
      else return null;
    });

    const { computedData, containerSize, updateSize } = useBase(
      data,
      computedLabels,
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

    const { hasNegativeValues } = checkNegativeValues(computedData);
    const { negativeBarAttributes } = useNegativeValues(
      containerSize,
      computedXScale,
      computedYScale,
      orientation
    );

    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    const { getTooltipAnchorAttributes, getTooltipItems, getInlineTooltipCoordinates } = useTooltipAnchors(
      computedData,
      computedXScale,
      computedYScale,
      orientation,
      chartType
    );

    const tooltipPosition = computed(
      () => allOptions.value.tooltipOptions?.position || 'top'
    );

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

    function handleTickMouseover(type: 'x' | 'y', index: number) {
      // Only capture hover on the label axis
      if (
        (orientation.value === ORIENTATIONS.VERTICAL && type === 'x') ||
        (orientation.value === ORIENTATIONS.HORIZONTAL && type === 'y')
      ) {
        mouseOverHandler.value(index);
      }
    }

    function handleMouseleave() {
      hoveredIndex.value = -1;
      hideTooltip();
    }

    onMounted(() => {
      if (!ctx.slots.groups?.()) {
        console.error('"groups" `<slot>` must have content.');
      }
    });

    return {
      allOptions,
      computedData,
      computedXAxisOptions,
      computedXScale,
      computedYAxisOptions,
      computedYScale,
      containerSize,
      getTooltipAnchorAttributes,
      getTooltipItems,
      handleMouseleave,
      handleTickMouseover,
      hasNegativeValues,
      hoveredIndex,
      mouseOverHandler,
      negativeBarAttributes,
      showXAxisTitle,
      showYAxisTitle,
      tooltipAnchor,
      tooltipConfig,
      tooltipPosition,
      updateSize,
      xAxisTitle,
      yAxisTitle,
      computedLabels,
      getInlineTooltipCoordinates,
      noData: NO_DATA
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
