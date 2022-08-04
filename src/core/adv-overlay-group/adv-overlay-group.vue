<template>
  <g class="adv-overlay-group">
    <adv-bar
      v-for="(_, index) in overlayData"
      v-bind="getOverlayBarAttributes(index)"
      :key="`overlay-${index}`"
      fill-class="adv-fill-color-transparent"
      :data-j-adv-overlay-group="index"
      :animate="false"
      @mouseover.native="handleMouseover(index)"
    />
  </g>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  toRefs,
} from '@vue/composition-api';

import AdvBar from '@/core/adv-bar';

import { Scale } from '@/mixins/scales';

import {
  getEmptyArrayFromData,
  getScaleStep,
  isBandScale,
} from '@/utils/helpers';
import { Orientation, ORIENTATIONS } from '@/constants';
import { Data } from '@/types/dataset';

export default defineComponent({
  components: { AdvBar },
  props: {
    data: {
      type: Array as PropType<Data>,
      required: true,
    },
    orientation: {
      type: String as PropType<Orientation>,
      default: ORIENTATIONS.VERTICAL,
    },
    xScale: {
      type: Function as PropType<Scale>,
      required: true,
    },
    yScale: {
      type: Function as PropType<Scale>,
      required: true,
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
