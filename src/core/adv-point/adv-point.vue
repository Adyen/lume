<template>
  <circle
    class="adv-point"
    :class="`adv-point--color-${color}`"
    :r="active ? radius : 0"
    :cx="cx"
    :cy="cy"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';

import { Scale } from '@/mixins/scales';

import { getScaleStep, isBandScale } from '@/utils/helpers';

export default defineComponent({
  props: {
    color: {
      type: String,
      default: '01',
    },
    radius: {
      type: Number,
      default: 4,
    },
    value: {
      type: Number,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
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
  setup(props) {
    const xAxisOffset = computed(() => getScaleStep(props.xScale) / 2);
    const domain = computed(() => props.xScale.domain());

    const cx = computed(() =>
      isBandScale(props.xScale)
        ? props.xScale(domain.value[props.index]) + xAxisOffset.value
        : props.xScale(props.index)
    );
    const cy = computed(() => props.yScale(props.value));

    return { cx, cy };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

.adv-point {
  fill: $adv-color-white;
  stroke-width: 2px;

  transition: all $chart-transition-time ease;
  pointer-events: none;

  @each $color, $map in $chart-colors {
    &--color-#{$color} {
      stroke: nth($map, 1);
    }
  }
}
</style>
