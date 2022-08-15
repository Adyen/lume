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
import { defineComponent, toRefs } from '@vue/composition-api';

import AdvChart from '@/core/adv-chart';
import AdvLineGroup from '@/core/adv-line-group';

import { useBase } from '@/mixins/base';
import { useOptions } from '@/mixins/options';
import { withChartProps } from '@/mixins/props';
import { useLineNullValues } from '@/mixins/line-null-values';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvLineGroup },
  props: {
    ...withChartProps(),
  },
  setup(props) {
    const { data, options } = toRefs(props);

    const { allOptions } = useOptions(options, defaultOptions);
    const { computedData } = useBase(data);
    const { computedLineData } = useLineNullValues(computedData);

    return {
      allOptions,
      computedLineData,
    };
  },
});
</script>
