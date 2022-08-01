<template>
  <component
    :is="component"
    v-bind="$props"
    :options="getBarChartOptions(options)"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

import { singleDatasetValidator } from '@/utils/helpers';
import { withChartProps } from '@/mixins/props';
import { Options } from '@/mixins/options';

const TYPES = ['grouped', 'stacked'];

function typeValidator(type: string): boolean {
  return TYPES.includes(type) || type == null;
}

export default defineComponent({
  components: {
    AdvSingleBarChart: () => import('@/charts/adv-single-bar-chart'),
    AdvGroupedBarChart: () => import('@/charts/adv-grouped-bar-chart'),
    AdvStackedBarChart: () => import('@/charts/adv-stacked-bar-chart'),
  },
  props: {
    ...withChartProps(),
    type: {
      type: String,
      default: null,
      validator: typeValidator,
    },
  },
  setup(props) {
    function getBarChartOptions(options: Options) {
      return {
        ...options,
        startOnZero: true, // Bar chart always starts on zero
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
