<template>
  <g class="lume-overlay-group">
    <lume-bar
      v-for="(_, index) in overlayData"
      v-bind="getOverlayBarAttributes(index)"
      :key="`overlay-${index}`"
      :data-j-lume-overlay-group="index"
      :transition="false"
      class-list="lume-fill-color--transparent"
      @mouseover.native="handleMouseover(index)"
    />
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

import LumeBar from '@/core/lume-bar';

import { withGroupProps } from '@/groups/composables/group-props';

import {
  getEmptyArrayFromData,
  getScaleStep,
  isBandScale,
} from '@/utils/helpers';
import { Orientation, ORIENTATIONS } from '@/constants';

export default defineComponent({
  components: { LumeBar },
  props: {
    ...withGroupProps(),
    orientation: {
      type: String as PropType<Orientation>,
      default: ORIENTATIONS.VERTICAL,
    },
  },

  setup(props, ctx) {
    const { data, orientation, xScale, yScale } = toRefs(props);

    const overlayData = computed(() => getEmptyArrayFromData(data));

    function getOverlayBarAttributes(index: number) {
      const referenceScale =
        orientation.value === ORIENTATIONS.HORIZONTAL
          ? yScale.value
          : xScale.value;
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
      ctx.emit('mouseover', index);
    }

    return { getOverlayBarAttributes, handleMouseover, overlayData };
  },
});
</script>
