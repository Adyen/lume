<template>
  <lume-chart
    v-bind="$props"
    chart-type="stacked-bar"
    :options="allOptions"
    :x-scale="stackedXScaleGenerator"
    :y-scale="stackedYScaleGenerator"
    data-j-stacked-bar-chart
  >
    <template #groups="props">
      <lume-bar-group
        v-bind="props"
        type="stacked"
      />
    </template>
  </lume-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import LumeChart from '@/core/lume-chart';
import LumeBarGroup from '@/groups/lume-bar-group';

import { useBase } from '@/composables/base';
import { useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';
import { useBarMixin } from '@/groups/lume-bar-group/composables/bar-mixin';
import { useStackedAxes } from '@/groups/lume-bar-group/composables/stacked-mixin';

import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { LumeChart, LumeBarGroup },
  props: {
    ...withChartProps(),
  },
  setup(props) {
    // State from mixins
    const { data, labels, orientation, options } = toRefs(props);

    const baseOptions = computed(
      () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
    );

    const { allOptions } = useOptions(options, baseOptions);

    const { internalData } = useBase(data, labels, orientation);

    const { groupedData } = useBarMixin(internalData);

    const { stackedXScaleGenerator, stackedYScaleGenerator } = useStackedAxes(
      groupedData,
      orientation
    );

    return {
      allOptions,
      stackedXScaleGenerator,
      stackedYScaleGenerator,
    };
  },
});
</script>
