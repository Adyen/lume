<template>
  <adv-chart
    :data="data"
    :labels="labels"
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

import { useBase, withBase } from '@/mixins/base';
import { useOptions, withOptions } from '@/mixins/options';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvLineGroup },
  props: {
    ...withBase(),
    ...withOptions(),
    startOnZero: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { data, labels, options, startOnZero } = toRefs(props);
    const { computedData } = useBase(data, labels);
    const { allOptions } = useOptions(options, defaultOptions);

    return {
      allOptions,
      computedData,
    };
  },
});
</script>
