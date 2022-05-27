<template>
  <circle
    class="line-chart__point"
    :class="`line-chart__point--color-${color}`"
    :r="active ? radius : 0"
    :cx="cx"
    :cy="cy"
    @click="$emit('point-click', index)"
    @mouseover="$emit('point-mouseover', index)"
    @mouseout="$emit('point-mouseout')"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { Scale } from '@/types/size';

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
    const xAxisOffset = computed(() => props.xScale.bandwidth() / 2);
    const domain = computed(() => props.xScale.domain());
    const cx = computed(
      () => props.xScale(domain.value[props.index]) + xAxisOffset.value
    );
    const cy = computed(() => props.yScale(props.value));

    return { cx, cy };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

.line-chart__point {
  transition: all $chart-transition-time ease;

  @each $color, $map in $chart-colors {
    &--color-#{$color} {
      fill: nth($map, 1);
    }
  }
}
</style>
