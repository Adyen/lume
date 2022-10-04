<template>
  <component
    :is="component"
    v-bind="$props"
    :options="getBarChartOptions(options)"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, PropType } from 'vue';

import { singleDatasetValidator } from '@/utils/helpers';
import { withChartProps } from '@/composables/props';
import { Options } from '@/composables/options';

import { ORIENTATIONS } from '@/constants';

enum TYPES {
  grouped = 'grouped',
  stacked = 'stacked',
}
const componentMap = {
  single: 'lume-single-bar-chart',
  grouped: 'lume-grouped-bar-chart',
  stacked: 'lume-stacked-bar-chart',
};

export default defineComponent({
  components: {
    LumeSingleBarChart: defineAsyncComponent(
      () => import('@/charts/lume-single-bar-chart')
    ),
    LumeGroupedBarChart: defineAsyncComponent(
      () => import('@/charts/lume-grouped-bar-chart')
    ),
    LumeStackedBarChart: defineAsyncComponent(
      () => import('@/charts/lume-stacked-bar-chart')
    ),
  },
  props: {
    ...withChartProps(),
    type: {
      type: String as PropType<TYPES>,
      default: null,
      validator: (type: string): boolean => type in TYPES || type == null,
    },
  },
  setup(props) {
    function getBarChartOptions(options: Options) {
      return {
        ...options,
        startOnZero: true, // Bar chart always starts on zero,
        tooltipOptions: {
          position: props.orientation === ORIENTATIONS.HORIZONTAL && 'right',
        },
      };
    }

    const component = computed(() => {
      if (!props.data) return;

      // Single bar chart
      if (singleDatasetValidator(props.data)) return componentMap.single;

      if (!props.type) {
        throw new Error(
          "Bar chart needs a type when there's multiple datasets."
        );
      }

      return componentMap[props.type];
    });

    return { component, getBarChartOptions };
  },
});
</script>
