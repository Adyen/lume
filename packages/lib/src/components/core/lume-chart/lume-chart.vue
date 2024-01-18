<template>
  <lume-chart-container
    :id="`lume-chart_${chartID}`"
    ref="chartContainer"
    :margins="computedMargins"
    :container-size="containerSize"
    :no-min-size="allOptions.noMinSize"
    :transparent-background="allOptions.transparentBackground"
    data-j-lume-chart
    @resize="updateSize"
    @click="emit('chart-click', $event)"
    @mouseenter="emit('chart-mouseenter', $event)"
    @mouseleave="handleMouseleave"
  >
    <template #header>
      <div class="lume-chart__header">
        <div class="lume-chart__header-section">
          <!-- chart title -->
          <h1
            v-if="title"
            class="lume-chart__title lume-chart-title lume-typography--display"
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
            class="lume-chart__axis-title lume-axis-title lume-typography--body"
          >
            {{ yAxisTitle }}
          </h3>

          <!-- chart legend -->
          <slot
            name="legend"
            :data="internalData"
          >
            <lume-chart-legend
              v-if="
                allOptions.withLegend !== false &&
                  allOptions.legendPosition !== 'bottom'
              "
              :data="internalData"
              class="lume-chart__legend"
              data-j-lume-chart__legend
              @click="emit('legend-click', $event)"
              @mouseenter="emit('legend-mouseenter', $event)"
              @mouseleave="emit('legend-mouseleave')"
            />
          </slot>
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
        v-if="allOptions.withAxes !== false"
        name="axes"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        :container-size="containerSize"
        :options="allOptions"
        :hovered-index="internalHoveredIndex"
      >
        <lume-axis
          type="x"
          :scale="computedXScale"
          :container-size="containerSize"
          :options="computedXAxisOptions"
          :hovered-index="internalHoveredIndex"
          :orientation="orientation"
          data-j-lume-chart__x-axis
          @click="handleAxisClick"
          @mouseenter="handleAxisMouseenter"
          @mouseleave="emit('axis-mouseleave')"
          @lume__internal--axis-size="xAxisHeight = $event"
        />
        <lume-axis
          type="y"
          :scale="computedYScale"
          :container-size="containerSize"
          :options="computedYAxisOptions"
          :hovered-index="internalHoveredIndex"
          :orientation="orientation"
          data-j-lume-chart__y-axis
          @click="handleAxisClick"
          @mouseenter="handleAxisMouseenter"
          @mouseleave="emit('axis-mouseleave')"
          @lume__internal--axis-size="yAxisWidth = $event"
        />
      </slot>

      <!-- Overlay bars -->
      <lume-overlay-group
        v-if="allOptions.withHover !== false"
        :data="internalData"
        :orientation="orientation"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        data-j-lume-chart__overlay-group
        @lume__internal--hover="handleInternalHover"
      />

      <!-- Tooltip anchors -->
      <g v-if="shouldGenerateTooltipAnchors">
        <circle
          v-for="(attrs, index) in tooltipAnchorAttributes"
          v-bind="attrs"
          ref="tooltipAnchor"
          :key="`anchor_${index}`"
          :r="TOOLTIP_ANCHOR_RADIUS"
          class="lume-fill--transparent"
        />
      </g>

      <!-- Data groups -->
      <slot
        name="groups"
        :data="internalData"
        :labels="computedLabels"
        :options="allOptions"
        :orientation="orientation"
        :x-scale="computedXScale"
        :y-scale="computedYScale"
        :hovered-index="internalHoveredIndex"
        :container-size="containerSize"
        :transition="allOptions.withTransition !== false"
        :class-list="classList"
        @node-click="emit('node-click', $event)"
        @node-mouseenter="emit('node-mouseenter', $event)"
        @node-mouseleave="emit('node-mouseleave', $event)"
        @link-click="emit('link-click', $event)"
        @link-mouseenter="emit('link-mouseenter', $event)"
        @link-mouseleave="emit('link-mouseleave', $event)"
        @bar-click="emit('bar-click', $event)"
        @line-click="emit('line-click', $event)"
        @point-click="emit('point-click', $event)"
        @lume__internal--hover="handleInternalHover"
      />
    </template>

    <template #footer>
      <!-- x axis title -->
      <h3
        v-if="showXAxisTitle"
        class="lume-chart__axis-title lume-chart__axis-title--centered lume-axis-title lume-typography--body"
      >
        {{ xAxisTitle }}
      </h3>

      <!-- bottom chart legend -->
      <lume-chart-legend
        v-if="
          allOptions.withLegend !== false &&
            allOptions.legendPosition == 'bottom'
        "
        :data="internalData"
        class="lume-chart__legend lume-chart__legend--bottom"
        data-j-lume-chart__legend
        @click="emit('legend-click', $event)"
        @mouseenter="emit('legend-mouseenter', $event)"
        @mouseleave="emit('legend-mouseleave')"
      />
    </template>

    <template #extra>
      <slot
        name="tooltip"
        v-bind="tooltipConfig"
        :data="internalData"
        :labels="computedLabels"
        :title="computedLabels[internalHoveredIndex]"
        :items="getTooltipItems(internalHoveredIndex)"
        :position="tooltipPosition"
        :with-tooltip="allOptions.withTooltip !== false"
        :hovered-index="internalHoveredIndex"
        :handle-mouse-enter="() => (isHoveringTooltip = true)"
        :handle-mouse-leave="() => (isHoveringTooltip = false)"
        :options="allOptions.tooltipOptions"
      >
        <lume-tooltip
          v-if="allOptions.withTooltip !== false"
          v-bind="tooltipConfig"
          :position="tooltipPosition"
          :title="computedLabels[internalHoveredIndex]"
          :items="getTooltipItems(internalHoveredIndex)"
          :options="allOptions.tooltipOptions"
          data-j-lume-chart__tooltip
          @opened="
            emit('tooltip-opened', {
              index: internalHoveredIndex,
              targetElement: $event,
            })
          "
          @moved="
            emit('tooltip-moved', {
              index: internalHoveredIndex,
              targetElement: $event,
            })
          "
          @closed="emit('tooltip-closed')"
          @tooltip-mouseenter="isHoveringTooltip = true"
          @tooltip-mouseleave="isHoveringTooltip = false"
        >
          <slot
            name="tooltip-content"
            :data="internalData"
            :labels="computedLabels"
            :hovered-index="internalHoveredIndex"
          />
        </lume-tooltip>
      </slot>
    </template>
  </lume-chart-container>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  PropType,
  provide,
  ref,
  toRefs,
  useSlots,
  watch,
} from 'vue';

import LumeAxis from '@/components/core/lume-axis';
import LumeBar from '@/components/core/lume-bar';
import LumeChartContainer from '@/components/core/lume-chart-container';
import LumeChartLegend from '@/components/core/lume-chart-legend';
import LumeTooltip from '@/components/core/lume-tooltip';
import LumeOverlayGroup from '@/components/groups/lume-overlay-group';

import { useBase } from '@/composables/base';
import { useEvents } from '@/composables/events';
import { withChartProps } from '@/composables/props';
import { isScale, Scale, useBaseScales } from '@/composables/scales';
import { ChartOptions, useOptions } from '@/composables/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/composables/negative-values';
import {
  AnchorAttributes,
  useTooltip,
  useTooltipAnchors,
  useTooltipItems,
} from '@/composables/tooltip';

import { ORIENTATIONS, TOOLTIP_ANCHOR_RADIUS } from '@/utils/constants';
import {
  calculateMarginBottom,
  calculateMarginLeft,
  calculateMarginRight,
  calculateMarginTop,
} from '@/utils/margins';
import { warn, Warnings } from '@/utils/warnings';
import { ChartType, Data } from '@/types/dataset';
import { ChartEmits } from '@/types/events';

const props = defineProps({
  ...withChartProps(),
  chartType: {
    type: String as PropType<ChartType>,
    default: null,
  },
});

const slots = useSlots();

// https://github.com/vuejs/core/issues/4294#issuecomment-1480392140
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Emits extends ChartEmits {}
const emit = defineEmits<Emits>();

const { data, labels, color, options, orientation, chartType } = toRefs(props);

const internalHoveredIndex = ref<number>(-1);
const tooltipAnchor = ref<Array<SVGCircleElement>>(null);
const chartContainer = ref<InstanceType<typeof LumeChartContainer>>(null);
const tooltipAnchorAttributes = ref<Array<AnchorAttributes>>([]);
const isHoveringTooltip = ref<boolean | null>(null);

const xAxisHeight = ref<number>(0);
const yAxisWidth = ref<number>(0);

const { allOptions } = useOptions<ChartOptions>(options);

const { internalData, computedLabels, containerSize, updateSize, chartID } =
  useBase(data, labels, color, allOptions, orientation);

const { listenInternalEvent } = useEvents(emit, chartID);

const { xScale, yScale } = useBaseScales(
  internalData,
  computedLabels,
  containerSize,
  orientation,
  allOptions
);

const computedMargins = computed(() => ({
  top: calculateMarginTop(allOptions.value.margins),
  right: calculateMarginRight(allOptions.value.margins),
  bottom: calculateMarginBottom(allOptions.value.margins, xAxisHeight.value),
  left: calculateMarginLeft(allOptions.value.margins, yAxisWidth.value),
}));

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
  return allOptions.value.xAxisOptions?.withTitle !== false && xAxisTitle.value;
});

const showYAxisTitle = computed(() => {
  return allOptions.value.yAxisOptions?.withTitle !== false && yAxisTitle.value;
});

const isEmpty = computed(() =>
  data.value.every((dataset) => !dataset.values.length)
);

const isReady = computed(() => {
  const conditions: Array<() => boolean> = [];

  const { noBaseScales } = allOptions.value;

  if (!noBaseScales && !isEmpty.value) {
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

const { shouldGenerateTooltipAnchors } = useTooltipAnchors(
  tooltipAnchorAttributes,
  allOptions,
  computedXScale,
  computedYScale,
  labels,
  orientation,
  internalData,
  chartType
);

const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

const { getTooltipItems } = useTooltipItems(internalData);

const tooltipPosition = computed(
  () => allOptions.value.tooltipOptions?.position || 'top'
);

const shouldHideTooltip = computed(() => {
  const arePointerEventsEnabled =
    allOptions.value.tooltipOptions?.withPointerEvents;
  return (
    tooltipConfig.opened &&
    (!arePointerEventsEnabled ||
      (arePointerEventsEnabled && isHoveringTooltip.value === false))
  );
});

function handleInternalHover(index: number) {
  // Skip the rest if the index didn't change
  if (index === internalHoveredIndex.value) return;

  // Update hoveredIndex
  const oldIndex = internalHoveredIndex.value;
  allOptions.value.withHover !== false && (internalHoveredIndex.value = index);

  if (allOptions.value.withTooltip !== false) {
    // Show/update tooltip
    const targetElement = !allOptions.value.tooltipOptions?.targetElement
      ? tooltipAnchor.value[index]
      : allOptions.value.tooltipOptions.targetElement === 'self'
        ? chartContainer.value.$el
        : allOptions.value.tooltipOptions.targetElement;
    showTooltip(targetElement);
  }
  emit('hovered-index-changed', { newIndex: index, oldIndex });
  emit('update:hoveredIndex', index);
}

function handleHideTooltip() {
  hideTooltip();
  internalHoveredIndex.value = -1;
  emit('update:hoveredIndex', -1);
}

function handleExternalHover(index: number) {
  const isValidHoveredIndex = data.value.some(
    ({ values }) => index <= values.length - 1
  );
  if (!isValidHoveredIndex) {
    warn(Warnings.InvalidHoveredIndex);
    return;
  }

  // If external index is null/undefined or -1, should hide
  if (index == null || index === -1) {
    handleHideTooltip();
  } else {
    handleInternalHover(index);
  }
}

function handleMouseleave() {
  setTimeout(() => {
    if (shouldHideTooltip.value) {
      handleHideTooltip();
    }
    emit('chart-mouseleave');
  }, 0);
}

function handleAxisMouseenter({ index, value, event }) {
  if (index !== null) handleInternalHover(index);
  emit('axis-mouseenter', { index, value, event });
}

function handleAxisClick({ index, value, event }) {
  emit('axis-click', { index, value, event });
}

watch(data, (newValue: Data, oldValue: Data | null) =>
  emit('data-changed', { newValue, oldValue })
);

watch(labels, (newValue: string[], oldValue: string[] | null) =>
  emit('labels-changed', { newValue, oldValue })
);

watch(isEmpty, (value) => value && warn(Warnings.Empty), { immediate: true });

watch(() => props.hoveredIndex, handleExternalHover);

// Covers initial prop value - needs to wait for tooltipAnchorAttributes (and hence tooltipAnchor ref) to be set to show tooltip
watch(
  tooltipAnchorAttributes,
  (value) => {
    if (
      value &&
      props.hoveredIndex != null &&
      internalHoveredIndex.value === -1
    ) {
      handleExternalHover(props.hoveredIndex);
    }
  },
  { flush: 'post' }
);

// Handles the scenario when the cursor is already outside of the chart container but in a tooltip and the user
// tries to leave the tooltip.
watch(isHoveringTooltip, (value) => {
  if (value === false && tooltipConfig.opened) {
    handleHideTooltip();
  }
});

onMounted(async () => {
  emit('rendered');
  if (!slots.groups) {
    console.error('"groups" `<slot>` must have content.');
  }

  if (__VUE_VERSION__ === 2) {
    listenInternalEvent('lume__internal--hover', handleInternalHover);
  }
});

provide('chartID', chartID);
provide('isEmpty', isEmpty);
provide('tooltipAnchorAttributes', tooltipAnchorAttributes); // provide anchors to re-compute in some cases
</script>

<style lang="scss" scoped>
@use './styles';
</style>
