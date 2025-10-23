<template>
  <circle
    ref="root"
    class="lume-point"
    :class="{
      [`lume-stroke--${color}`]: true,
      'lume-point--active': active,
      [`lume-point--visible lume-fill--${color}`]: visible,
    }"
    :cx="x"
    :cy="y"
    :r="computedRadius"
    :stroke-width="strokeWidth"
    data-j-point
    @click="emit('click', $event)"
  />
</template>

<script lang="ts">
const DEFAULT_RADIUS = 4; // 4px; If together with a `lume-line`, should double its width
const DEFAULT_VISIBLE_RADIUS = 3;
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Colors } from '@/types/utils';
import { svgCheck } from '@/utils/svg-check';

const props = withDefaults(
  defineProps<{
    x: number;
    y: number;
    color?: Colors | string;
    radius?: number;
    active?: boolean;
    visible?: boolean;
  }>(),
  {
    color: Colors.Skyblue,
    radius: DEFAULT_RADIUS,
    active: false,
    visible: false,
  }
);

const emit = defineEmits<{ (e: 'click', p: MouseEvent): void }>();

const root = ref<SVGCircleElement>(null);

const strokeWidth = computed(() => props.radius / 2);

const computedRadius = computed(() => {
  if (props.active) return props.radius;
  if (props.visible) return DEFAULT_VISIBLE_RADIUS;
  return 0;
});

onMounted(() => svgCheck(root.value));
</script>

<style lang="scss" scoped>
@use './styles';
</style>
