<template>
  <adv-chart
    v-bind="$props"
    :options="allOptions"
  >
    <template #groups="props">
      <adv-line-group v-bind="props" />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs } from '@vue/composition-api';

import AdvChart from '@/core/adv-chart';
import AdvLineGroup from '@/core/adv-line-group/';

import { useOptions } from '@/mixins/options';
import { withChartProps } from '@/mixins/props';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvLineGroup },
  props: {
    ...withChartProps(),
  },
  setup(props) {
    const { options } = toRefs(props);
    const { allOptions } = useOptions(options, defaultOptions);

    return {
      allOptions,
    };
  },
});
</script>
