<template>
  <lume-chart
    v-bind="props"
    chart-type="stacked-bar"
    :options="allOptions"
    :x-scale="stackedXScaleGenerator"
    :y-scale="stackedYScaleGenerator"
    data-j-stacked-bar-chart
    v-on="componentEventPropagator"
  >
    <template #groups="groupProps">
      <lume-bar-group
        v-bind="groupProps"
        type="stacked"
        v-on="componentEventPropagator"
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
import { useEvents } from '@/composables/events';
import { BarChartOptions, useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';
import { useBarMixin } from '@/components/groups/lume-bar-group/composables/bar-mixin';
import { useStackedAxes } from '@/components/groups/lume-bar-group/composables/stacked-mixin';

import { ChartEmits } from '@/types/events';
import { ORIENTATIONS } from '@/utils/constants';
import { excludeGroups } from '@/utils/helpers';

import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withChartProps<BarChartOptions>(),
});

// https://github.com/vuejs/core/issues/4294#issuecomment-1480392140
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Emits extends ChartEmits {}
const emit = defineEmits<Emits>();

const { componentEventPropagator } = useEvents(emit);

const slots = excludeGroups(useSlots());

const { data, orientation, options } = toRefs(props);

const baseOptions = computed(
  () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
);

const { allOptions } = useOptions(
  options,
  baseOptions as ComputedRef<BarChartOptions>
);

const { internalData } = useBase(data);

const { groupedData } = useBarMixin(internalData);

const { stackedXScaleGenerator, stackedYScaleGenerator } = useStackedAxes(
  groupedData,
  orientation,
  options
);
</script>
