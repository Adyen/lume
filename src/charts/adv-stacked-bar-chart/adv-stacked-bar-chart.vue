<template>
  <adv-chart
    v-bind="$props"
    chart-type="stacked-bar-chart"
    :data="computedData"
    :options="allOptions"
    :x-scale="stackedXScaleGenerator"
    :y-scale="stackedYScaleGenerator"
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

import { useBase } from '@/mixins/base';
import { useOptions } from '@/mixins/options';
import { withChartProps } from '@/mixins/props';
import {
  useBarMixin,
  withBarProps,
} from '@/core/adv-bar-group/mixins/bar-mixin';
import { useStackedAxes } from '@/core/adv-bar-group/mixins/stacked-mixin';

import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvBarGroup },
  props: {
    ...withChartProps(),
    ...withBarProps(),
  },
  setup(props) {
    // State from mixins
    const { data, labels, orientation, options } = toRefs(props);

    const { allOptions } = useOptions(
      options,
      defaultOptions[orientation.value || ORIENTATIONS.VERTICAL]
    );

    const { computedData } = useBase(data, labels, orientation);

    const { groupedData } = useBarMixin(computedData);

    const { stackedXScaleGenerator, stackedYScaleGenerator } = useStackedAxes(
      groupedData,
      orientation
    );

    return {
      allOptions,
      computedData,
      stackedXScaleGenerator,
      stackedYScaleGenerator,
    };
  },
});
</script>
