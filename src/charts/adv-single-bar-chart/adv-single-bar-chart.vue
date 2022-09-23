<template>
  <adv-chart
    v-bind="$props"
    chart-type="single-bar"
    :data="computedData"
    :options="allOptions"
    data-j-single-bar-chart
  >
    <template #groups="props">
      <adv-bar-group
        v-bind="props"
        :orientation="orientation"
      />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvBarGroup from '@/groups/adv-bar-group';

import { useBase } from '@/composables/base';
import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';

import { singleDatasetValidator } from '@/utils/helpers';
import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvBarGroup },
  props: {
    ...withChartProps(singleDatasetValidator),
  },
  setup(props) {
    // State from mixins
    const { data, labels, orientation, options } = toRefs(props);

    const baseOptions = computed(
      () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
    );

    const { allOptions } = useOptions(options, baseOptions);

    const { computedData } = useBase(data, labels, orientation);

    return { allOptions, computedData };
  },
});
</script>
