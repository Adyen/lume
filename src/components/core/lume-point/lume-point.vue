<template>
  <circle
    ref="root"
    class="lume-point"
    :class="`lume-stroke--${color}`"
    :cx="cx"
    :cy="cy"
    :r="active ? radius : 0"
    :stroke-width="strokeWidth"
    data-j-point
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';

import { Scale } from '@/composables/scales';

import { Colors } from '@/constants';
import { getScaleStep, isBandScale } from '@/utils/helpers';
import { svgCheck } from '@/utils/svg-check';

const DEFAULT_RADIUS = 4; // 4px; If together with a `lume-line`, should double its width

export default defineComponent({
  props: {
    color: {
      type: String,
      default: Colors.Skyblue,
    },
    radius: {
      type: Number,
      default: DEFAULT_RADIUS,
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
    const root = ref<SVGCircleElement>(null);

    const xAxisOffset = computed(() => getScaleStep(props.xScale) / 2);
    const domain = computed(() => props.xScale.domain());

    const cx = computed(() =>
      isBandScale(props.xScale)
        ? props.xScale(domain.value[props.index]) + xAxisOffset.value
        : props.xScale(props.index)
    );
    const cy = computed(() => props.yScale(props.value));

    const strokeWidth = computed(() => props.radius / 2);

    onMounted(() => svgCheck(root.value));

    return { cx, cy, root, strokeWidth };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
