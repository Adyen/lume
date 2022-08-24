<template>
  <path
    class="adv-line"
    :class="{
      [`adv-stroke-color--${color}`]: true,
      'adv-line--dashed': dashed,
      'adv-line--transition': transition,
    }"
    :d="pathDefinition"
    :style="{
      animationDelay: transition && animationDelay,
      animationDuration: transition && animationDuration + 's',
    }"
    data-j-line
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { ScaleBand, ScaleLinear } from 'd3-scale';
import { line } from 'd3-shape';

import { Scale } from '@/mixins/scales';

import { getDomainLength, getScaleStep, isBandScale } from '@/utils/helpers';

import styleVariables from '@/styles/_variables.scss';

const ADV_TRANSITION_TIME_FULL = parseFloat(styleVariables.transitionTimeFull);

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
    transition: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const animationDuration = computed(
      () => ADV_TRANSITION_TIME_FULL / getDomainLength(props.xScale)
    );

    const animationDelay = computed(
      () => props.transition && props.index * animationDuration.value + 's'
    );

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

    return { animationDelay, animationDuration, pathDefinition };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
