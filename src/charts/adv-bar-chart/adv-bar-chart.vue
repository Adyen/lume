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

export default defineComponent({
  components: {
    AdvSingleBarChart: defineAsyncComponent(
      () => import('@/charts/adv-single-bar-chart')
    ),
    AdvGroupedBarChart: defineAsyncComponent(
      () => import('@/charts/adv-grouped-bar-chart')
    ),
    AdvStackedBarChart: defineAsyncComponent(
      () => import('@/charts/adv-stacked-bar-chart')
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
      if (singleDatasetValidator(props.data)) return 'adv-single-bar-chart';

      if (!props.type)
        throw new Error(
          "Bar chart needs a type when there's multiple datasets."
        );

      return `adv-${props.type}-bar-chart`;
    });

    return { component, getBarChartOptions };
  },
});
</script>
