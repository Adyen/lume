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
        />
      </g>
      <g
        class="lume-line-group__points"
        data-j-lume-line-group__points
      >
        <lume-point
          v-for="(_, index) in dataset.values"
          v-bind="getPointProperties(index, datasetIndex)"
          :key="`point-${index}`"
          :active="isPointActive(index)"
          :color="dataset.color"
          :radius="pointRadius"
        >
          <title
            :id="`point-${index}-${chartID}`"
            role="datavalue"
          >
            {{ value.value }}
          </title>
        </lume-point>
      </g>
    </g>
  </g>
</template>

<script lang="ts">
const LUME_TRANSITION_TIME_FULL = 1; // 1s
</script>

<script setup lang="ts">
import { computed, inject, Ref, toRefs } from 'vue';
import { ScaleLinear } from 'd3';

import LumeLine from '@/components/core/lume-line';
import LumePoint from '@/components/core/lume-point';

import { getXByIndex } from '@/composables/scales';
import { useLineNullValues } from '@/composables/line-null-values';
import { getLinePathDefinition } from '@/composables/line-values';
import { withGroupProps } from '@/composables/group-props';
import { LineChartOptions } from '@/composables/options';
import { AnchorAttributes, useTooltipAnchors } from '@/composables/tooltip';

import {
  getDomainLength,
  getHighestValue,
  getScaleStep,
  isBandScale,
} from '@/utils/helpers';

const props = defineProps({
  ...withGroupProps<LineChartOptions>(),
  transition: {
    type: Boolean,
    default: true,
  },
});

const { data, options, xScale, yScale } = toRefs(props);

const tooltipAnchorAttributes = inject<Ref<AnchorAttributes[]> | null>(
  'tooltipAnchorAttributes',
  null
);
const { updateTooltipAnchorAttributes } = useTooltipAnchors(
  tooltipAnchorAttributes,
  options,
  xScale,
  yScale
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
  // If no `lineWidth`, returns NaN which needs to be undefined
  () =>
    options.value?.withPoints ? options.value?.lineWidth * 2 || undefined : 0
);

const xAxisOffset = computed(() => getScaleStep(xScale.value) / 2);
const domain = computed(() => xScale.value.domain() as Array<number>);

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

function getPointProperties(pointIndex: number, datasetIndex: number) {
  const value = getValuesFromDataset(datasetIndex)[pointIndex]?.value;

  return {
    x: isBandScale(xScale.value)
      ? props.xScale(domain.value[pointIndex]) + xAxisOffset.value
      : props.xScale(pointIndex),
    y: yScale.value(value),
    a11yProperties: {
      tabindex: 0,
      role: 'datapoint',
      'aria-labelledby': getAriaLabelledby(pointIndex),
    },
  };
}

function isPointActive(index: number) {
  return props.hoveredIndex === index;
}

const chartID = inject('chartID');

/*
 * This only is relevant for the a11y of a line chart, where the orientation is always horizontal.
 * Therefore we can assume the label axis is always the x-axis
 * */
function getAriaLabelledby(index) {
  return `x-${index}-${chartID} point-${index}-${chartID}`;
}
</script>

<style lang="scss" scoped>
@use './styles';
</style>
