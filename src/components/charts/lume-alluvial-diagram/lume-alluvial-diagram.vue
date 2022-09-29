<template>
  <lume-chart
    v-bind="props"
    :options="getAlluvialDiagramOptions(allOptions)"
    data-j-alluvial-diagram
  >
    <template #groups="groupProps">
      <lume-alluvial-group v-bind="groupProps" />
    </template>
    <template
      v-for="(_, name) in slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData || {}"
      />
    </template>
  </lume-chart>
</template>

<script setup lang="ts">
import { toRefs, useSlots } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeAlluvialGroup from '@/components/groups/lume-alluvial-group';

import { withChartProps } from '@/composables/props';
import { ChartOptions, useOptions } from '@/composables/options';

import { excludeGroups, singleDatasetValidator } from '@/utils/helpers';
import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withChartProps(singleDatasetValidator, false, false),
});

const slots = excludeGroups(useSlots());

const { options } = toRefs(props);

const { allOptions } = useOptions(options, defaultOptions);

function getAlluvialDiagramOptions(options: ChartOptions) {
  return {
    ...options,
    noBaseScales: true, // Alluvial chart never uses base scales
  };
}
</script>