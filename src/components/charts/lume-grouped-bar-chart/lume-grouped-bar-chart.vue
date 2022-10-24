<template>
  <lume-chart
    v-bind="$props"
    chart-type="grouped-bar"
    :options="allOptions"
    data-j-grouped-bar-chart
  >
    <template #groups="props">
      <lume-bar-group
        v-bind="props"
        type="grouped"
      />
    </template>
  </lume-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeBarGroup from '@/components/groups/lume-bar-group';

import { BarChartOptions, useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { LumeChart, LumeBarGroup },
  props: {
    ...withChartProps<BarChartOptions>(),
  },
  setup(props) {
    // State from mixins
    const { orientation, options } = toRefs(props);

    const baseOptions = computed(
      () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
    );

    const { allOptions } = useOptions(options, baseOptions);

    return { allOptions };
  },
});
</script>
