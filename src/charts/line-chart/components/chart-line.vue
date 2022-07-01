<template>
  <g>
    <path
      class="line-chart__line"
      :class="{
        [`line-chart__line--color-${color}`]: true,
        ['line-chart__line--dashed']: dashed,
      }"
      :d="pathDefinition"
    />
  </g>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { line } from 'd3-shape';
import { Scale } from '@/types/size';

export default defineComponent({
  props: {
    color: {
      type: String,
      default: '01',
    },
    index: {
      type: Number,
      required: true,
    },
    values: {
      type: Array,
      required: true,
    },
    dashed: {
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

    const pathDefinition = computed(() => {
      return line()
        .x(
          (_, i) =>
            props.xScale(props.xScale.domain()[props.index + (i - 1)]) +
            xAxisOffset.value
        )
        .y((d) => props.yScale(d))(props.values);
    });

    return { pathDefinition };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

$line-stroke-width: 2px;
$line-stroke-hover-width: 4px;
$ghost-line-stroke-width: 8px;

.line-chart__line {
  stroke-width: $line-stroke-width;
  stroke-linejoin: round;
  stroke-linecap: round;
  fill: none;
  transition: all $chart-transition-time ease;
  pointer-events: none;

  @each $color, $map in $chart-colors {
    &--color-#{$color} {
      stroke: nth($map, 1);
    }
  }

  &--dashed {
    stroke-dasharray: 2%;
  }
}
</style>
