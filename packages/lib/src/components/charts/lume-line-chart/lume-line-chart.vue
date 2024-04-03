<template>
  <lume-chart
    v-bind="{ ...props, ...$attrs }"
    chart-type="line"
    :options="allOptions"
    data-j-lume-line-chart
    v-on="componentEventPropagator"
  >
    <template #groups="groupProps">
      <lume-line-group
        v-bind="groupProps"
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
import { toRefs, useSlots } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeLineGroup from '@/components/groups/lume-line-group';

import { useEvents } from '@/composables/events';
import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import type { ChartEmits } from '@/types/events';
import type { LineChartOptions } from '@/types/options';

import { excludeGroups } from '@/utils/helpers';

import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withChartProps<LineChartOptions>(null, false),
});

// https://github.com/vuejs/core/issues/4294#issuecomment-1480392140
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Emits extends ChartEmits {}
const emit = defineEmits<Emits>();

const { componentEventPropagator } = useEvents(emit);

const slots = excludeGroups(useSlots());

const { options } = toRefs(props);

const { allOptions } = useOptions(options, defaultOptions);
</script>
