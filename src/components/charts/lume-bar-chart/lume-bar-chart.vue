<template>
  <component
    :is="component"
    v-bind="{ ...props, ...$attrs }"
    :options="getBarChartOptions(options)"
  >
    <template
      v-for="(_, name) in slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData || {}"
      />
    </template>
  </component>
</template>

<script lang="ts">
enum TYPES {
  grouped = 'grouped',
  stacked = 'stacked',
}
</script>

<script setup lang="ts">
import { computed, defineAsyncComponent, PropType, useSlots } from 'vue';

import { excludeGroups, singleDatasetValidator } from '@/utils/helpers';
import { withChartProps } from '@/composables/props';
import {
  BarChartOptions,
  Options,
  TooltipOptions,
} from '@/composables/options';

import { ORIENTATIONS } from '@/constants';

const LumeSingleBarChart = defineAsyncComponent(
  () => import('@/components/charts/lume-single-bar-chart')
);
const LumeGroupedBarChart = defineAsyncComponent(
  () => import('@/components/charts/lume-grouped-bar-chart')
);
const LumeStackedBarChart = defineAsyncComponent(
  () => import('@/components/charts/lume-stacked-bar-chart')
);
const COMPONENT_MAP = new Map([
  ['single', LumeSingleBarChart],
  ['grouped', LumeGroupedBarChart],
  ['stacked', LumeStackedBarChart],
]);

const props = defineProps({
  ...withChartProps<BarChartOptions>(),
  type: {
    type: String as PropType<TYPES>,
    default: null,
    validator: (type: string): boolean => type in TYPES || type == null,
  },
});

const slots = excludeGroups(useSlots());

function getBarChartOptions(options: Options) {
  return {
    ...options,
    startOnZero: true, // Bar chart always starts on zero,
    tooltipOptions: {
      ...((options?.tooltipOptions as TooltipOptions) || {}),
      position: props.orientation === ORIENTATIONS.HORIZONTAL && 'right',
    },
  };
}

const component = computed(() => {
  if (!props.data) return;

  // Single bar chart
  if (singleDatasetValidator(props.data)) return COMPONENT_MAP.get('single');

  if (!props.type) {
    throw new Error("Bar chart needs a type when there's multiple datasets.");
  }

  return COMPONENT_MAP.get(props.type);
});
</script>
