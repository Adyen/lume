<template>
  <path
    class="adv-line"
    :class="{
      ['adv-line--dashed']: dashed,
      [`adv-stroke-color--${color}`]: true,
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
@use './styles';
</style>
