<template>
  <lume-chart
    v-bind="$props"
    :options="options"
    :style="{ width: `${width}px` }"
    class-list="bar-sparkline"
  >
    <template #groups="groupProps">
      <lume-bar-group v-bind="groupProps" />

      <g>
        <rect
          v-for="(_l, index) in groupProps.labels.length"
          v-bind="getBarCapProps(index, groupProps)"
          :key="`cap_${index}`"
        />
      </g>
    </template>
  </lume-chart>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeBarGroup from '@/components/groups/lume-bar-group';

import { withChartProps } from '@/composables/props';

import type { ChartOptions } from '@/types/options';

const props = defineProps({
  ...withChartProps(),
  barWidth: {
    type: Number,
    required: true,
  },
  gap: {
    type: Number,
    required: true,
  },
});

const { barWidth, gap } = toRefs(props);

const barCount = computed(() => props.data[0].values.length);
const width = computed(
  () => barCount.value * barWidth.value + (barCount.value - 1) * gap.value
);

const options = computed<ChartOptions>(() => ({
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
  noMinSize: true,
  paddingInner: gap.value / (barWidth.value + gap.value),
  paddingOuter: 0,
  startOnZero: true,
  withAxes: false,
  withLegend: false,
}));

function getBarCapProps(index: number, { data, xScale, yScale }) {
  const values = data[0].values;
  return {
    width: barWidth.value,
    height: 2,
    x: xScale(index),
    y: yScale(values[index].value),
    class: [
      'bar-sparkline__cap',
      values[index].value > 70
        ? 'bar-sparkline__cap--red'
        : 'bar-sparkline__cap--green',
    ],
  };
}
</script>

<style lang="scss">
.bar-sparkline {
  opacity: 0.3;

  transition: opacity 0.1s ease-in-out !important;

  &:hover {
    opacity: 0.5;
  }

  &__cap {
    &--green {
      fill: var(--lume-color--green);
    }
    &--red {
      fill: var(--lume-color--red);
    }
  }
}
</style>
