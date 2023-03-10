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
        :key="`bar-${groupIndex}-${index}`"
        :a11y-properties="getA11yProperties(groupIndex, index)"
        :transition="computedTransition"
        :orientation="orientation"
        data-j-lume-bar
      >
        <title
          v-if="groupIndex !== null"
          :id="`point-${groupIndex}-${index}-${chartID}`"
          role="datavalue"
        >
          {{ barValue.value }}
        </title>
      </lume-bar>
    </g>
  </g>
</template>

<script lang="ts">
const MIXIN_MAP = {
  single: useSingleBarMixin,
  grouped: useGroupedBarMixin,
  stacked: useStackedBarMixin,
};
</script>

<script setup lang="ts">
import { computed, inject, PropType, toRefs } from 'vue';

import LumeBar from '@/components/core/lume-bar';

import { withGroupProps } from '@/composables/group-props';
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

const props = defineProps({
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
});

const chartID = inject('chartID');

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

function getAriaLabelledby(groupIndex, index) {
  const axisId = `${
    props.orientation === ORIENTATIONS.HORIZONTAL ? 'y' : 'x'
  }-${groupIndex}-${chartID}`;
  const valueId = `point-${groupIndex}-${index}-${chartID}`;
  return `${axisId} ${valueId}`;
}

/*
 * Note that not all bars will represent a value that ought to be read.
 * For example, negative value indication bars and hover bars serve no meaning.
 * */
function getA11yProperties(groupIndex, index) {
  return groupIndex === null
    ? {}
    : {
      role: 'datapoint',
      tabindex: 0,
      'aria-labelledby': getAriaLabelledby(groupIndex, index),
    };
}
</script>
