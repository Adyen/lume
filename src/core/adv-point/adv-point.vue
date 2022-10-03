<template>
  <circle
    class="adv-point"
    :class="`adv-stroke--${color}`"
    :r="active ? radius : 0"
    :cx="cx"
    :cy="cy"
    data-j-point
  />
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

import { Scale } from '@/composables/scales';

import { getScaleStep, isBandScale } from '@/utils/helpers';

const props = defineProps({
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
});

const xAxisOffset = computed(() => getScaleStep(props.xScale) / 2);
const domain = computed(() => props.xScale.domain());

const cx = computed(() =>
  isBandScale(props.xScale)
    ? props.xScale(domain.value[props.index]) + xAxisOffset.value
    : props.xScale(props.index)
);
const cy = computed(() => props.yScale(props.value));
</script>

<style lang="scss" scoped>
@use './styles';
</style>
