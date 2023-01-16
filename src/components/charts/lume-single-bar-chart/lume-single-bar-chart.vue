<template>
  <lume-chart
    v-bind="props"
    chart-type="single-bar"
    :options="allOptions"
    data-j-single-bar-chart
  >
    <template #groups="groupProps">
      <lume-bar-group
        v-bind="groupProps"
        :orientation="orientation"
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

import { excludeGroups, singleDatasetValidator } from '@/utils/helpers';
import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withChartProps<BarChartOptions>(singleDatasetValidator),
});

const slots = excludeGroups(useSlots());

const { orientation, options } = toRefs(props);

const baseOptions = computed(
  () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
);

const { allOptions } = useOptions(options, baseOptions);
</script>
