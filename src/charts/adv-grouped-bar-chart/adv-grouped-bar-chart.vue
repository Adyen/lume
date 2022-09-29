<template>
  <adv-chart
    v-bind="props"
    chart-type="grouped-bar"
    :options="allOptions"
    data-j-grouped-bar-chart
  >
    <template #groups="groupProps">
      <adv-bar-group
        v-bind="groupProps"
        type="grouped"
      />
    </template>
  </adv-chart>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvBarGroup from '@/groups/adv-bar-group';

import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withChartProps(),
});

const { orientation, options } = toRefs(props);

const baseOptions = computed(
  () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
);

const { allOptions } = useOptions(options, baseOptions);
</script>
