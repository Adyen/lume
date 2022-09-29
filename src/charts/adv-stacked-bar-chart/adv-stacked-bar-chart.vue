<template>
  <adv-chart
    v-bind="props"
    chart-type="stacked-bar"
    :options="allOptions"
    :x-scale="stackedXScaleGenerator"
    :y-scale="stackedYScaleGenerator"
    data-j-stacked-bar-chart
  >
    <template #groups="groupProps">
      <adv-bar-group
        v-bind="groupProps"
        type="stacked"
      />
    </template>
  </adv-chart>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvBarGroup from '@/groups/adv-bar-group';

import { useBase } from '@/composables/base';
import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';
import { useBarMixin } from '@/groups/adv-bar-group/composables/bar-mixin';
import { useStackedAxes } from '@/groups/adv-bar-group/composables/stacked-mixin';

import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withChartProps(),
});

const { data, orientation, options } = toRefs(props);

const baseOptions = computed(
  () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
);

const { allOptions } = useOptions(options, baseOptions);

const { internalData } = useBase(data);

const { groupedData } = useBarMixin(internalData);

const { stackedXScaleGenerator, stackedYScaleGenerator } = useStackedAxes(
  groupedData,
  orientation
);
</script>
