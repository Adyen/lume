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
const DEFAULT_RADIUS = 4; // 4px; If together with a `lume-line`, should double its width
</script>

<script setup lang="ts">
import { computed, onMounted, PropType, ref } from 'vue';

import { Scale } from '@/composables/scales';

import { Colors } from '@/utils/constants';
import { getScaleStep, isBandScale } from '@/utils/helpers';
import { svgCheck } from '@/utils/svg-check';

const props = defineProps({
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
});

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
</script>

<style lang="scss" scoped>
@use './styles';
</style>
