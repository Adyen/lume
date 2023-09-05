<template>
  <g
    class="lume-bar-group"
    data-j-bars-group
  >
    <g
      v-for="(barGroup, groupIndex) in groupedData"
      :key="groupIndex"
      @mouseenter="handleInternalHover(groupIndex)"
    >
      <lume-bar
        v-for="(barValue, index) in barGroup"
        v-bind="getBarAttributes(barValue, index, groupIndex, barGroup)"
        :key="`bar-${index}`"
        :transition="computedTransition"
        data-j-lume-bar
        @click="
          emit('bar-click', {
            index: groupIndex,
            datasetIndex: index,
            event: $event,
          })
        "
      />
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

import { useEvents } from '@/composables/events';
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

const emit = defineEmits<{
  (
    e: 'bar-click',
    p: { index: number; datasetIndex: number; event: MouseEvent }
  );
  (e: 'lume__internal--hover', p: number);
}>();

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

const chartID = inject<string>('chartID');

const { busEmit } = useEvents(emit, chartID);

const { groupedData } = useBarMixin(data);

const { barXScale, barYScale } = useBarScales(xScale, yScale, orientation);

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

async function handleInternalHover(groupIndex: number) {
  emit('lume__internal--hover', groupIndex);

  if (__VUE_VERSION__ === 2) {
    await busEmit('lume__internal--hover', groupIndex);
  }
}
</script>
