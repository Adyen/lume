<template>
  <g
    class="lume-line-group"
    data-j-lume-line-group
  >
    <!-- Overlay dashed line -->
    <path
      v-bind="overlayLineAttributes"
      class="lume-line-group__overlay-line"
      data-j-lume-line-group__overlay-line
    />

    <!-- Line groups -->
    <g
      v-for="(dataset, datasetIndex) in computedGroupData"
      :key="dataset.label"
      class="lume-line-group__group"
    >
      <g class="lume-line-group__lines">
        <lume-line
          v-for="(_, index) in dataset.values"
          v-bind="getLineTransitionParams(index)"
          :key="`line-${index}`"
          :color="dataset.color"
          :dashed="dataset.isDashed(index)"
          :path-definition="getPathDefinition(index, datasetIndex)"
          :transition="transition"
          :width="options.lineWidth"
          @click="emit('line-click', { index, datasetIndex, event: $event })"
        />
      </g>
      <g
        v-if="computedWithPoints"
        class="lume-line-group__points"
        data-j-lume-line-group__points
      >
        <template
          v-for="(value, index) in dataset.values"
          :key="`point-${index}`"
        >
          <lume-point
            v-if="!value.isNull"
            v-bind="getPointPosition(index, datasetIndex)"
            :active="isPointActive(index)"
            :color="dataset.color"
            :index="index"
            :radius="pointRadius"
            :visible="computedVisiblePoints"
            @click="emit('point-click', { index, datasetIndex, event: $event })"
          />
        </template>
      </g>
    </g>
  </g>
</template>

<script lang="ts">
const LUME_TRANSITION_TIME_FULL = 1; // 1s
</script>

<script setup lang="ts">
import { computed, inject, Ref, toRefs } from 'vue';
import { ScaleBand, ScaleLinear } from 'd3';

import LumeLine from '@/components/core/lume-line';
import LumePoint from '@/components/core/lume-point';

import { getXByIndex } from '@/composables/scales';
import { useLineNullValues } from '@/composables/line-null-values';
import { getLinePathDefinition } from '@/composables/line-values';
import { withGroupProps } from '@/composables/group-props';
import { AnchorAttributes, useTooltipAnchors } from '@/composables/tooltip';

import { getDomainLength, getHighestValue, isBandScale } from '@/utils/helpers';
import type { LineChartOptions } from '@/types/options';

const props = defineProps({
  ...withGroupProps<LineChartOptions>(),
  withPoints: {
    type: [Boolean, String],
    default: true,
  },
  transition: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (
    e: 'line-click' | 'point-click',
    p: { index: number; datasetIndex: number; event: MouseEvent }
  ): void;
  (e: 'lume__internal--hover', p: number);
}>();

const { data, options, xScale, yScale, labels } = toRefs(props);

const tooltipAnchorAttributes = inject<Ref<AnchorAttributes[]> | null>(
  'tooltipAnchorAttributes',
  null
);
const { updateTooltipAnchorAttributes } = useTooltipAnchors(
  tooltipAnchorAttributes,
  options,
  xScale,
  yScale,
  labels
);

const computedGroupData = computed(() => {
  // Check if all datasets have `isDashed` function (which means data has been computed for line null values)
  if (data.value.every((dataset) => dataset.isDashed)) {
    return data.value;
  }

  // Compute line null values and return it
  const { computedLineData } = useLineNullValues(data);

  if (options.value.withTooltip !== false && tooltipAnchorAttributes?.value) {
    updateTooltipAnchorAttributes(computedLineData.value); // Updates tooltip anchors for null values
  }

  return computedLineData.value;
});

const overlayLineAttributes = computed(() => {
  if (props.hoveredIndex === -1) return;

  const highestValue = getHighestValue(
    computedGroupData.value,
    props.hoveredIndex
  );
  const x = getXByIndex(xScale.value, props.hoveredIndex);

  return {
    d: `M ${x},${yScale.value.range()[1]}
        V ${yScale.value(highestValue)}`, // Move to X index, Vertical line to the highest point
  };
});

const animationDuration = computed(
  () =>
    xScale.value &&
    LUME_TRANSITION_TIME_FULL / (getDomainLength(xScale.value) - 1) // Subtracting the first line (read below)
);

const pointRadius = computed(
  () => options.value?.lineWidth * 2 || undefined // If no `lineWidth`, returns NaN which needs to be undefined
);

const xAxisOffset = computed(
  () => (xScale.value as ScaleBand<string | number>).bandwidth() / 2
);
const domain = computed(() => xScale.value.domain() as Array<number>);

const computedWithPoints = computed(
  () => options.value.withPoints ?? props.withPoints
);
const computedVisiblePoints = computed(
  () => options.value.withPoints === 'visible' || props.withPoints === 'visible'
);

function getValuesFromDataset(datasetIndex: number) {
  return computedGroupData.value[datasetIndex].values;
}

function getPathDefinition(lineIndex: number, datasetIndex: number) {
  const values =
    lineIndex === 0
      ? []
      : [
          getValuesFromDataset(datasetIndex)[lineIndex - 1]?.value,
          getValuesFromDataset(datasetIndex)[lineIndex]?.value,
        ];

  return (
    getLinePathDefinition(
      lineIndex,
      values,
      xScale.value,
      yScale.value as ScaleLinear<number, number>
    ) || ''
  );
}

function getLineTransitionParams(lineIndex: number) {
  const animationDelay =
    lineIndex < 2 ? 0 : (lineIndex - 1) * animationDuration.value;
  return {
    animationDelay,
    animationDuration: animationDuration.value,
  };
}

function getPointPosition(pointIndex: number, datasetIndex: number) {
  const value = getValuesFromDataset(datasetIndex)[pointIndex]?.value;

  return {
    x: isBandScale(xScale.value)
      ? props.xScale(domain.value[pointIndex]) + xAxisOffset.value
      : props.xScale(pointIndex),
    y:
      value === null
        ? yScale.value(yScale.value.domain()[1] as number)
        : yScale.value(value),
  };
}

function isPointActive(index: number) {
  return props.hoveredIndex === index;
}
</script>

<style lang="scss" scoped>
@use './styles';
</style>
