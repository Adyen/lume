<template>
  <g>
    <text
      v-for="(value, index) in computedData[0].values"
      v-bind="getEmojiPosition(value.value, index)"
      :key="`emoji-${index}`"
      class="emoji"
      :class="hoveredIndex === index && 'emoji--hovered'"
    >
      {{ EMOJIS[index] }}
    </text>

    <adv-bar
      v-for="(_, index) in computedData[0].values"
      v-bind="getOverlayBarAttributes(index)"
      :key="`overlay-${index}`"
      fill-class="adv-fill-color-transparent"
      @mouseover.native="handleMouseover(index)"
    />
  </g>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from '@vue/composition-api';
import { ScaleBand, ScaleLinear } from 'd3-scale';

import AdvBar from '@/core/adv-bar';

import { Data } from '@/types/dataset';
import { useBase } from '@/mixins/base';
import { withGroup } from '@/mixins/group';
import { getScaleStep, isBandScale } from '@/utils/helpers';

const EMOJIS = ['🚓', '🍟', '🍺', '🎱', '🐻', '🐶', '💈'];

export default defineComponent({
  components: { AdvBar },
  props: {
    data: {
      type: Array as PropType<Data>,
      required: true,
    },
    xScale: {
      type: Function as PropType<ScaleBand<number | string>>,
      required: true,
    },
    yScale: {
      type: Function as PropType<ScaleLinear<number, number>>,
      required: true,
    },
    hoveredIndex: {
      type: Number,
      default: -1,
    },
    ...withGroup(),
  },
  setup(props) {
    const { data, xScale, yScale } = toRefs(props);

    const { computedData } = useBase(data);

    function getEmojiPosition(value: number, index: number) {
      return {
        x:
          xScale.value(xScale.value.domain()[index]) +
          xScale.value.bandwidth() / 2,
        y: yScale.value(value),
      };
    }

    function getOverlayBarAttributes(index: number) {
      const step = getScaleStep(xScale.value);
      const translateX = isBandScale(xScale.value)
        ? xScale.value(xScale.value.domain()[index])
        : xScale.value(index) - step / 2;

      return {
        width: step,
        height: yScale.value(Math.min(...yScale.value.domain())),
        transform: `translate(${translateX}, 0)`,
      };
    }

    function handleMouseover(index: number) {
      props?.onMouseoverFn(index);
    }

    return {
      computedData,
      EMOJIS,
      getEmojiPosition,
      getOverlayBarAttributes,
      handleMouseover,
    };
  },
});
</script>

<style lang="scss" scoped>
.emoji {
  font-size: 32px;
  transform: translateX(-18px);
  dominant-baseline: middle;
  transition: all 0.1s ease-out;
  cursor: default;

  &--hovered {
    font-size: 44px;
    transform: translateX(-23px);
  }
}
</style>
