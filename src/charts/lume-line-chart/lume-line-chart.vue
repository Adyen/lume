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
  </lume-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

import LumeChart from '@/core/lume-chart';
import LumeLineGroup from '@/groups/lume-line-group';

import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { LumeChart, LumeLineGroup },
  props: {
    ...withChartProps(),
  },
  setup(props) {
    const { options } = toRefs(props);

    const { allOptions } = useOptions(options, defaultOptions);

    return { allOptions };
  },
});
</script>
