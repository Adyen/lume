<template>
  <g class="lume-overlay-group">
    <lume-bar
      v-for="(_, index) in overlayData"
      v-bind="getOverlayBarAttributes(index)"
      :key="`overlay-${index}`"
      :data-j-lume-overlay-group="index"
      :transition="false"
      class-list="lume-fill--transparent"
      @mouseover.native="handleMouseover(index)"
    />
  </g>
</template>

<script setup lang="ts">
import { computed, PropType, toRefs } from 'vue';

import LumeBar from '@/components/core/lume-bar';

import { withGroupProps } from '@/components/groups/composables/group-props';

import {
  getEmptyArrayFromData,
  getScaleStep,
  isBandScale,
} from '@/utils/helpers';
import { Orientation, ORIENTATIONS } from '@/constants';

const props = defineProps({
  ...withGroupProps(),
  orientation: {
    type: String as PropType<Orientation>,
    default: ORIENTATIONS.VERTICAL,
  },
});

const emit = defineEmits(['mouseover']);

const { data, orientation, xScale, yScale } = toRefs(props);

const overlayData = computed(() => getEmptyArrayFromData(data));

function getOverlayBarAttributes(index: number) {
  const referenceScale =
    orientation.value === ORIENTATIONS.HORIZONTAL ? yScale.value : xScale.value;
  const domain = referenceScale.domain();
  const step = getScaleStep(referenceScale);

  const translate = isBandScale(referenceScale)
    ? referenceScale(domain[index])
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

function handleMouseover(index: number) {
  emit('mouseover', index);
}
</script>
