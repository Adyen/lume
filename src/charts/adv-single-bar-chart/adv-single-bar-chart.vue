<template>
  <adv-chart
    v-bind="$props"
    :data="computedData"
    :options="allOptions"
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
import { computed, defineComponent, toRefs } from '@vue/composition-api';

import AdvChart from '@/core/adv-chart';
import AdvBarGroup from '@/core/adv-bar-group';

import { useBase } from '@/mixins/base';
import { useOptions } from '@/mixins/options';
import { withChartProps } from '@/mixins/props';
import { withBarProps } from '@/core/adv-bar-group/mixins/bar-mixin';

import { Data } from '@/types/dataset';
import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

const singleBarDataValidator = (data: Data) => data.length === 1;

export default defineComponent({
  components: { AdvChart, AdvBarGroup },
  props: {
    ...withChartProps(singleBarDataValidator),
    ...withBarProps(),
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
