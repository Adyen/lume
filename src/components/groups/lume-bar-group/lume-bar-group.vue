<template>
  <g
    class="lume-bar-group"
    data-j-bars-group
  >
    <g
      v-for="(barGroup, groupIndex) in groupedData"
      :key="groupIndex"
    >
      <lume-bar
        v-for="(barValue, index) in barGroup"
        v-bind="getBarAttributes(barValue, index, groupIndex, barGroup)"
        :key="`bar-${index}`"
        :transition="computedTransition"
        data-j-lume-bar
      />
    </g>
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

import LumeBar from '@/components/core/lume-bar';

import { withGroupProps } from '@/components/groups/composables/group-props';
import {
  getBarChartType,
  useBarMixin,
  useBarScales,
  withBarProps,
} from './composables/bar-mixin';

import { useSingleBarMixin } from './composables/single-mixin';
import { useGroupedBarMixin } from './composables/grouped-mixin';
import { useStackedBarMixin } from './composables/stacked-mixin';

import { ORIENTATIONS } from '@/utils/constants';

const MIXIN_MAP = {
  single: useSingleBarMixin,
  grouped: useGroupedBarMixin,
  stacked: useStackedBarMixin,
};

export default defineComponent({
  components: { LumeBar },
  props: {
    ...withGroupProps(),
    classList: {
      type: [String, Array] as PropType<string | Array<string>>,
      default: () => [],
    },
    ...withBarProps(true),
    transition: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const {
      data,
      hoveredIndex,
      options,
      orientation,
      transition,
      type,
      xScale,
      yScale,
      classList,
    } = toRefs(props);

    const { groupedData } = useBarMixin(data);

    const { barXScale, barYScale } = useBarScales(
      xScale,
      yScale,
      options,
      orientation
    );

    const computedClasses = computed(() => {
      if (typeof classList.value === 'string') return [classList.value];
      return classList.value;
    });

    const getBarAttributes = computed(() => {
      const chartType = getBarChartType(data, type);

      const { barAttributeGenerator } = MIXIN_MAP[chartType](
        data,
        barXScale,
        barYScale,
        orientation,
        hoveredIndex,
        computedClasses.value
      );
      return barAttributeGenerator;
    });

    const computedTransition = computed(() => {
      if (!transition.value) return;
      return orientation.value === ORIENTATIONS.HORIZONTAL ? 'width' : 'height';
    });

    return {
      barXScale,
      barYScale,
      computedTransition,
      getBarAttributes,
      groupedData,
    };
  },
});
</script>
