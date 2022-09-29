<template>
  <adv-chart
    v-bind="props"
    chart-type="line"
    :options="allOptions"
    data-j-adv-line-chart
  >
    <template #groups="groupProps">
      <adv-line-group v-bind="groupProps" />
    </template>
  </adv-chart>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvLineGroup from '@/groups/adv-line-group';

import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withChartProps(),
});

const { options } = toRefs(props);

const { allOptions } = useOptions(options, defaultOptions);
</script>
