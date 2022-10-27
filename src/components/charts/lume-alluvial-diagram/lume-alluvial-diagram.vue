<template>
  <lume-chart
    v-bind="$props"
    :options="getAlluvialDiagramOptions(allOptions)"
    data-j-alluvial-diagram
  >
    <template #groups="props">
      <lume-alluvial-group v-bind="props" />
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
import LumeAlluvialGroup from '@/components/groups/lume-alluvial-group';

import { withChartProps } from '@/composables/props';
import { ChartOptions, useOptions } from '@/composables/options';

import { singleDatasetValidator } from '@/utils/helpers';
import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { LumeChart, LumeAlluvialGroup },
  props: {
    ...withChartProps(singleDatasetValidator),
  },
  setup(props, context) {
    const { options } = toRefs(props);

    const { allOptions } = useOptions(options, defaultOptions);

    function getAlluvialDiagramOptions(options: ChartOptions) {
      return {
        ...options,
        noBaseScales: true, // Alluvial chart never uses base scales
      };
    }

    return { allOptions, getAlluvialDiagramOptions, slots: context.slots };
  },
});
</script>
