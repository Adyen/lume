<template>
  <g
    class="adv-bar-group"
    data-j-bars-group
  >
    <g
      v-for="(barGroup, groupIndex) in groupedData"
      :key="groupIndex"
    >
      <adv-bar
        v-for="(barValue, index) in barGroup"
        v-bind="getBarAttributes(barValue, index, groupIndex, barGroup)"
        :key="`bar-${index}`"
        :transition="computedTransition"
        data-j-adv-bar
      />
    </g>
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

import AdvBar from '@/core/adv-bar';

import { useBase } from '@/mixins/base';
import { Scale } from '@/mixins/scales';
import {
  getBarChartType,
  useBarMixin,
  useBarScales,
  withBarProps,
} from './mixins/bar-mixin';

import { useSingleBarMixin } from './mixins/single-mixin';
import { useGroupedBarMixin } from './mixins/grouped-mixin';
import { useStackedBarMixin } from './mixins/stacked-mixin';

import { Data } from '@/types/dataset';
import { ORIENTATIONS } from '@/constants';

const MIXIN_MAP = {
  single: useSingleBarMixin,
  grouped: useGroupedBarMixin,
  stacked: useStackedBarMixin,
};

export default defineComponent({
  components: { AdvBar },
  props: {
    data: {
      type: Array as PropType<Data>,
      required: true,
    },
    xScale: {
      type: Function as PropType<Scale>,
      required: true,
    },
    yScale: {
      type: Function as PropType<Scale>,
      required: true,
    },
    hoveredIndex: {
      type: Number,
      default: -1,
    },
    transition: {
      type: Boolean,
      default: true,
    },
    classList: {
      type: [String, Array] as PropType<string | Array<string>>,
      default: () => [],
    },
    ...withBarProps(true),
  },
  setup(props) {
    const {
      data,
      hoveredIndex,
      orientation,
      transition,
      type,
      xScale,
      yScale,
      classList,
    } = toRefs(props);

    const { computedData } = useBase(data);

    const { groupedData } = useBarMixin(computedData);

    const { barXScale, barYScale } = useBarScales(xScale, yScale, orientation);

    const computedClasses = computed(() => {
      if (typeof classList.value === 'string') return [classList.value];
      return classList.value;
    });

    const getBarAttributes = computed(() => {
      const chartType = getBarChartType(computedData, type);

      const { barAttributeGenerator } = MIXIN_MAP[chartType](
        computedData,
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
