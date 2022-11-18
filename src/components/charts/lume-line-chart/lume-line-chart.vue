<template>
  <lume-chart
    v-bind="$props"
    chart-type="line"
    :options="allOptions"
    data-j-lume-line-chart
  >
    <template #groups="props">
      <lume-line-group v-bind="props" />
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

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeLineGroup from '@/components/groups/lume-line-group';

import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { options as defaultOptions } from './defaults';
import { excludeGroups } from '@/utils/helpers';

export default defineComponent({
  components: { LumeChart, LumeLineGroup },
  props: {
    ...withChartProps(null, false),
  },
  setup(props, context) {
    const { options } = toRefs(props);

    const { allOptions } = useOptions(options, defaultOptions);

    return { allOptions, slots: excludeGroups(context.slots) };
  },
});
</script>
