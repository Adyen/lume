<template>
  <adv-chart
    v-bind="$props"
    chart-type="grouped-bar"
    :options="allOptions"
    data-j-grouped-bar-chart
  >
    <template #groups="props">
      <adv-bar-group
        v-bind="props"
        type="grouped"
      />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvBarGroup from '@/groups/adv-bar-group';

import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvBarGroup },
  props: {
    ...withChartProps(),
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
