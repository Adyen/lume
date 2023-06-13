<template>
  <lume-chart
    v-bind="props"
    chart-type="stacked-bar"
    :options="allOptions"
    :x-scale="stackedXScaleGenerator"
    :y-scale="stackedYScaleGenerator"
    data-j-stacked-bar-chart
  >
    <template #groups="groupProps">
      <lume-bar-group
        v-bind="groupProps"
        type="stacked"
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
import { computed, ComputedRef, toRefs, useSlots } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeBarGroup from '@/components/groups/lume-bar-group';

import { useBase } from '@/composables/base';
import { ChartOptions, useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';
import { useBarMixin } from '@/components/groups/lume-bar-group/composables/bar-mixin';
import { useStackedAxes } from '@/components/groups/lume-bar-group/composables/stacked-mixin';

import { ORIENTATIONS } from '@/utils/constants';

import { options as defaultOptions } from './defaults';
import { excludeGroups } from '@/utils/helpers';

const props = defineProps({
  ...withChartProps<ChartOptions>(),
});

const slots = excludeGroups(useSlots());

const { data, orientation, options } = toRefs(props);

const baseOptions = computed(
  () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
);

const { allOptions } = useOptions(
  options,
  baseOptions as ComputedRef<ChartOptions>
);

const { internalData } = useBase(data);

const { groupedData } = useBarMixin(internalData);

const { stackedXScaleGenerator, stackedYScaleGenerator } = useStackedAxes(
  groupedData,
  orientation
);
</script>
