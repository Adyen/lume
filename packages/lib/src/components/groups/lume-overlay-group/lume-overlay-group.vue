<template>
  <g class="lume-overlay-group">
    <lume-bar
      v-for="(_, index) in overlayData"
      v-bind="getOverlayBarAttributes(index)"
      :key="`overlay-${index}`"
      :data-j-lume-overlay-group="index"
      :transition="false"
      class-list="lume-fill--transparent"
      @mouseover="emit('lume__internal--hover', index)"
      @click="emit('click', { index, event: $event })"
    />
  </g>
</template>

<script setup lang="ts">
import { computed, PropType, toRefs } from 'vue';

import LumeBar from '@/components/core/lume-bar';

import { withGroupProps } from '@/composables/group-props';

import {
  getEmptyArrayFromData,
  getScaleStep,
  isBandScale,
} from '@/utils/helpers';
import { ORIENTATIONS } from '@/utils/constants';
import type { Orientation } from '@/types/utils';
import { ScaleBand } from 'd3';

const props = defineProps({
  ...withGroupProps(),
  orientation: {
    type: String as PropType<Orientation>,
    default: ORIENTATIONS.VERTICAL,
  },
});

const emit = defineEmits<{
  (e: 'click', p: { index: number; event: MouseEvent });
  (e: 'lume__internal--hover', p: number);
  (e: 'mouseover', p: number);
}>();

const { data, orientation, xScale, yScale } = toRefs(props);

const overlayData = computed(() => getEmptyArrayFromData(data));

function getOverlayBarAttributes(index: number) {
  const referenceScale =
    orientation.value === ORIENTATIONS.HORIZONTAL ? yScale.value : xScale.value;
  const domain = referenceScale.domain();
  const step = getScaleStep(referenceScale);

  const paddingInner =
    (referenceScale as ScaleBand<string | number>).paddingInner?.() ?? 0;
  const correction = step * paddingInner;

  const translate = isBandScale(referenceScale)
    ? referenceScale(domain[index]) - correction / 2
    : referenceScale(index) - step / 2;

  return orientation.value === ORIENTATIONS.HORIZONTAL
    ? {
      width: Math.max(...xScale.value.range()),
      height: step,
      transform: `translate(0, ${translate})`,
    }
    : {
      width: step,
      height: Math.max(...yScale.value.range()),
      transform: `translate(${translate}, 0)`,
    };
}
</script>
