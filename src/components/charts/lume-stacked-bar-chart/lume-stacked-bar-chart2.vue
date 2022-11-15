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
        :data="fn2(props)"
        type="stacked"
      />
    </template>
    <template
      v-for="(_, name) in slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData || {}"
      />
    </template>
  </lume-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeBarGroup from '@/components/groups/lume-bar-group';

import { useBase } from '@/composables/base';
import { BarChartOptions, useOptions } from '@/composables/options';
import { withChartProps } from '@/composables/props';
import { useBarMixin } from '@/components/groups/lume-bar-group/composables/bar-mixin';
import { useStackedAxes } from '@/components/groups/lume-bar-group/composables/stacked-mixin';

import { ORIENTATIONS } from '@/constants';

import { options as defaultOptions } from './defaults';
import { excludeGroups } from '@/utils/helpers';

export default defineComponent({
  components: { LumeChart, LumeBarGroup },
  props: {
    ...withChartProps<BarChartOptions>(),
  },
  setup(props, context) {
    // State from mixins
    const { data, orientation, options } = toRefs(props);

    const baseOptions = computed(
      () => defaultOptions[orientation.value || ORIENTATIONS.VERTICAL] // needs to be computed so that default options are reactive
    );

    const { allOptions } = useOptions(options, baseOptions);

    const { internalData } = useBase(data);

    const { groupedData } = useBarMixin(internalData);

    const { stackedXScaleGenerator, stackedYScaleGenerator } = useStackedAxes(
      groupedData,
      orientation
    );

    function fn2(s) {
      if (!s?.data) return [];
      return [...s.data].reverse();
    }

    return {
      allOptions,
      stackedXScaleGenerator,
      stackedYScaleGenerator,
      slots: excludeGroups(context.slots),
      fn2,
    };
  },
});
</script>
