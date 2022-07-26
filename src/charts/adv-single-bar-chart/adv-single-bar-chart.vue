<template>
  <adv-chart
    :data="computedData"
    :labels="labels"
    :options="allOptions"
    :orientation="orientation"
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
import { defineComponent, toRefs } from '@vue/composition-api';

import AdvChart from '@/core/adv-chart';
import AdvBarGroup from '@/core/adv-bar-group';

import { useBase, withBase } from '@/mixins/base';
import { useOptions, withOptions } from '@/mixins/options';
import { withBarProps } from '../bar-chart/mixins/bar-mixin';

import { Data } from '@/types/dataset';
import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

const singleBarDataValidator = (data: Data) => data.length === 1;

export default defineComponent({
  components: { AdvChart, AdvBarGroup },
  props: {
    ...withBase(singleBarDataValidator),
    ...withBarProps(),
    ...withOptions(),
  },
  setup(props) {
    // State from mixins
    const { data, labels, orientation, options } = toRefs(props);

    const { allOptions } = useOptions(
      options,
      defaultOptions[orientation.value || ORIENTATIONS.VERTICAL]
    );

    const { computedData } = useBase(data, labels, orientation);

    return { allOptions, computedData };
  },
});
</script>
