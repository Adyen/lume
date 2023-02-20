<template>
  <circle
    ref="root"
    class="lume-point"
    :class="`lume-stroke--${color}`"
    :cx="x"
    :cy="y"
    :r="active ? radius : 0"
    :stroke-width="strokeWidth"
    data-j-point
  />
</template>

<script lang="ts">
const DEFAULT_RADIUS = 4; // 4px; If together with a `lume-line`, should double its width
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Colors } from '@/utils/constants';
import { svgCheck } from '@/utils/svg-check';

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  color: {
    type: String,
    default: Colors.Skyblue,
  },
  radius: {
    type: Number,
    default: DEFAULT_RADIUS,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const root = ref<SVGCircleElement>(null);

const strokeWidth = computed(() => props.radius / 2);

onMounted(() => svgCheck(root.value));
</script>

<style lang="scss" scoped>
@use './styles';
</style>
