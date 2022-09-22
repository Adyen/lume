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
  </g>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue';
import { ScaleBand, ScaleLinear } from 'd3-scale';

import { useBase } from '@/composables/base';

import { Data } from '@/types/dataset';

const EMOJIS = ['🚓', '🍟', '🍺', '🎱', '🐻', '🐶', '💈'];

export default defineComponent({
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

    return {
      computedData,
      EMOJIS,
      getEmojiPosition,
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
