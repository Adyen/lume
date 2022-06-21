<template>
  <component
    :is="component"
    v-bind="$props"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from '@vue/composition-api';

import { Orientation, ORIENTATIONS } from '@/constants';
import { withBase } from '@/mixins/base';
import { withOptions } from '@/mixins/options';
import { singleDatasetValidator } from '@/utils/helpers';

const TYPES = ['grouped', 'stacked'];

function typeValidator(type: string): boolean {
  return TYPES.includes(type) || type == null;
}

function orientationValidator(orientation: string): boolean {
  return Object.values(ORIENTATIONS).includes(orientation as Orientation);
}

export default defineComponent({
  components: {
    SingleBarChart: () => import('@/charts/single-bar-chart'),
    GroupedBarChart: () => import('@/charts/grouped-bar-chart'),
    StackedBarChart: () => import('@/charts/stacked-bar-chart'),
  },
  props: {
    ...withBase(),
    ...withOptions(),
    type: {
      type: String,
      default: null,
      validator: typeValidator,
    },
    orientation: {
      type: String as PropType<Orientation>,
      default: 'vertical',
      validator: orientationValidator,
    },
  },
  setup(props) {
    const component = computed(() => {
      if (!props.data) return;

      // Single bar chart
      if (singleDatasetValidator(props.data)) return 'single-bar-chart';

      if (!props.type)
        throw new Error(
          "Bar chart needs a type when there's multiple datasets."
        );

      // const orientationString =
      //   props.orientation === ORIENTATIONS.HORIZONTAL
      //     ? ORIENTATIONS.HORIZONTAL + '-'
      //     : '';
      // return `${orientationString}${props.type}-bar-chart`;
      return `${props.type}-bar-chart`;
    });

    return { component };
  },
});
</script>
