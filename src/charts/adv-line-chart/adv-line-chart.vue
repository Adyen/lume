<template>
  <adv-chart
    v-bind="$props"
    chart-type="line"
    :data="computedLineData"
    :options="allOptions"
    data-j-adv-line-chart
  >
    <template #groups="props">
      <adv-line-group v-bind="props" />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvLineGroup from '@/groups/adv-line-group';

import { useBase } from '@/composables/base';
import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';
import { useLineNullValues } from '@/composables/line-null-values';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvLineGroup },
  props: {
    ...withChartProps(),
  },
  setup(props) {
    const { data, options } = toRefs(props);

    const { allOptions } = useOptions(options, defaultOptions);
    const { internalData } = useBase(data);
    const { computedLineData } = useLineNullValues(internalData);

    return {
      allOptions,
      computedLineData,
    };
  },
});
</script>
