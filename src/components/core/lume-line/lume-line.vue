<template>
  <path
    ref="root"
    class="lume-line"
    :class="{
      [`lume-stroke--${color}`]: true,
      'lume-line--dashed': dashed,
      'lume-line--transition': transition,
    }"
    :d="pathDefinition"
    :style="{
      animationDelay: transition && animationDelay + 's',
      animationDuration: transition && animationDuration + 's',
    }"
    data-j-line
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import { ScaleBand, ScaleLinear } from 'd3';
import { line } from 'd3';

import { Scale } from '@/composables/scales';

import { getDomainLength, getScaleStep, isBandScale } from '@/utils/helpers';
import { svgCheck } from '@/utils/svg-check';

const LUME_TRANSITION_TIME_FULL = 1; // 1s

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
    const root = ref<SVGPathElement>(null);

    const animationDuration = computed(
      () => LUME_TRANSITION_TIME_FULL / (getDomainLength(props.xScale) - 1) // Subtracting the first line (read below)
    );

    const animationDelay = computed(() => {
      // 0 index is the first line point (which isn't really a line), so it shouldn't have delay
      // 1 index is the actual first line drawn, so it also shouldn't have delay
      if (props.index < 2) return 0;
      return props.transition && (props.index - 1) * animationDuration.value;
    });

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
      const lineFn = line<number>()
        .x(isBandScale(props.xScale) ? findBandX : findLinearX)
        .y((d) => props.yScale(d));

      return lineFn(props.values);
    });

    onMounted(() => svgCheck(root.value));

    return { animationDelay, animationDuration, pathDefinition, root };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
