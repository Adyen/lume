<template>
  <component
    :is="component"
    v-bind="{ ...props, ...$attrs }"
    :options="getBarChartOptions(options)"
  />
</template>

<script lang="ts">
enum TYPES {
  grouped = 'grouped',
  stacked = 'stacked',
}
</script>

<script setup lang="ts">
import { computed, defineAsyncComponent, PropType } from 'vue';

import { singleDatasetValidator } from '@/utils/helpers';
import { withChartProps } from '@/composables/props';
import { Options } from '@/composables/options';

const AdvSingleBarChart = defineAsyncComponent(
  () => import('@/charts/adv-single-bar-chart')
);
const AdvGroupedBarChart = defineAsyncComponent(
  () => import('@/charts/adv-grouped-bar-chart')
);

const AdvStackedBarChart = defineAsyncComponent(
  () => import('@/charts/adv-stacked-bar-chart')
);

import { ORIENTATIONS } from '@/constants';

const componentMap = new Map([
  ['single', AdvSingleBarChart],
  ['grouped', AdvGroupedBarChart],
  ['stacked', AdvStackedBarChart],
]);

const props = defineProps({
  ...withChartProps(),
  type: {
    type: String as PropType<TYPES>,
    default: null,
    validator: (type: string): boolean => type in TYPES || type == null,
  },
});

function getBarChartOptions(options: Options) {
  return {
    ...options,
    startOnZero: true, // Bar chart always starts on zero,
    tooltipOptions: {
      position: props.orientation === ORIENTATIONS.HORIZONTAL && 'right',
    },
  };
}

const component = computed(() => {
  if (!props.data) return;

  // Single bar chart
  if (singleDatasetValidator(props.data)) return componentMap.get('single');

  if (!props.type) {
    throw new Error("Bar chart needs a type when there's multiple datasets.");
  }

  return componentMap.get(props.type);
});
</script>
