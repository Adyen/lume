<template>
  <adv-chart
    v-bind="$props"
    :options="getAlluvialChartOptions(allOptions)"
    data-j-alluvial-chart
  >
    <template #groups="props">
      <adv-alluvial-group v-bind="props" />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvAlluvialGroup from '@/groups/adv-alluvial-group';

import { withChartProps } from '@/composables/props';
import { ChartOptions, useOptions } from '@/composables/options';

import { singleDatasetValidator } from '@/utils/helpers';
import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvAlluvialGroup },
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
