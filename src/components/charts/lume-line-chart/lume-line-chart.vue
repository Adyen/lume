<template>
  <lume-chart
    v-bind="props"
    chart-type="line"
    :options="allOptions"
    data-j-lume-line-chart
  >
    <template #groups="groupProps">
      <lume-line-group v-bind="groupProps" />
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
import LumeLineGroup from '@/components/groups/lume-line-group';

import { LineChartOptions, useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { options as defaultOptions } from './defaults';
import { excludeGroups } from '@/utils/helpers';

const props = defineProps({
  ...withChartProps<LineChartOptions>(null, false),
});

const slots = excludeGroups(useSlots());

const { options } = toRefs(props);

const { allOptions } = useOptions(options, defaultOptions);
</script>