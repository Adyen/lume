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
        :type="type"
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

import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvBarGroup },
  props: {
    ...withBase(),
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
