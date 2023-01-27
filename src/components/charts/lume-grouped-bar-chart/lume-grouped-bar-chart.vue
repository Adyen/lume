<template>
  <lume-chart
    v-bind="props"
    chart-type="grouped-bar"
    :options="allOptions"
    data-j-grouped-bar-chart
  >
    <template #groups="groupProps">
      <lume-bar-group
        v-bind="groupProps"
        type="grouped"
      />
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
import { computed, toRefs, useSlots } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeBarGroup from '@/components/groups/lume-bar-group';

import { BarChartOptions, useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { ORIENTATIONS } from '@/utils/constants';

import { options as defaultOptions } from './defaults';
import { excludeGroups } from '@/utils/helpers';

const props = defineProps({
  ...withChartProps<BarChartOptions>(),
});

const slots = excludeGroups(useSlots());

const { orientation, options } = toRefs(props);

const baseOptions = computed(
  () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
);

const { allOptions } = useOptions(options, baseOptions);
</script>
