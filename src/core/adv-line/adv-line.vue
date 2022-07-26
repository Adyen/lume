<template>
  <path
    class="adv-line"
    :class="{
      [`adv-line--color-${color}`]: true,
      ['adv-line--dashed']: dashed,
    }"
    :d="pathDefinition"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { line } from 'd3-shape';

import { Scale } from '@/mixins/scales';

import { getScaleStep, isBandScale } from '@/utils/helpers';

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
      type: Array as PropType<Array<number>>,
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
    const xAxisOffset = computed(() => getScaleStep(props.xScale) / 2);

    function findLinearX(_: unknown, index: number) {
      return (props.xScale as ScaleLinear<number, number>)(
        props.index + (index - 1)
      );
    }

    function findBandX(_: unknown, index: number) {
      return (
        (props.xScale as ScaleBand<string | number>)(
          props.xScale.domain()[props.index + (index - 1)]
        ) + xAxisOffset.value
      );
    }

    const pathDefinition = computed(() => {
      return line<number>()
        .x(isBandScale(props.xScale) ? findBandX : findLinearX)
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

.adv-line {
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
