<template>
  <adv-chart
    v-bind="props"
    :options="getAlluvialChartOptions(allOptions)"
    data-j-alluvial-chart
  >
    <template #groups="groupProps">
      <adv-alluvial-group v-bind="groupProps" />
    </template>
  </adv-chart>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvAlluvialGroup from '@/groups/adv-alluvial-group';

import { withChartProps } from '@/composables/props';
import { ChartOptions, useOptions } from '@/composables/options';

import { singleDatasetValidator } from '@/utils/helpers';
import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withChartProps(singleDatasetValidator),
});

const { options } = toRefs(props);

const { allOptions } = useOptions(options, defaultOptions);

function getAlluvialChartOptions(options: ChartOptions) {
  return {
    ...options,
    noBaseScales: true, // Alluvial chart never uses base scales
  };
}
</script>
