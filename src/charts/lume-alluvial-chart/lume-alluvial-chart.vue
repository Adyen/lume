<template>
  <lume-chart
    v-bind="$props"
    :options="getAlluvialChartOptions(allOptions)"
    data-j-alluvial-chart
  >
    <template #groups="props">
      <lume-alluvial-group v-bind="props" />
    </template>
  </lume-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

import LumeChart from '@/core/lume-chart';
import LumeAlluvialGroup from '@/groups/lume-alluvial-group';

import { withChartProps } from '@/composables/props';
import { ChartOptions, useOptions } from '@/composables/options';

import { singleDatasetValidator } from '@/utils/helpers';
import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { LumeChart, LumeAlluvialGroup },
  props: {
    ...withChartProps(singleDatasetValidator),
  },
  setup(props) {
    const { options } = toRefs(props);

    const { allOptions } = useOptions(options, defaultOptions);

    function getAlluvialChartOptions(options: ChartOptions) {
      return {
        ...options,
        noBaseScales: true, // Alluvial chart never uses base scales
      };
    }

    return { allOptions, getAlluvialChartOptions };
  },
});
</script>
