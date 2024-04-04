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
    :stroke-width="width"
    :style="{
      animationDelay: transition && animationDelay + 's',
      animationDuration: transition && animationDuration + 's',
    }"
    data-j-line
    @click="emit('click', $event)"
  />
</template>

<script lang="ts">
const DEFAULT_LINE_WIDTH = 2; // 2px
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { svgCheck } from '@/utils/svg-check';

import { Colors } from '@/types/utils';

defineProps({
  pathDefinition: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: DEFAULT_LINE_WIDTH,
  },
  color: {
    type: String,
    default: Colors.Skyblue,
  },
  dashed: {
    type: Boolean,
    default: false,
  },
  transition: {
    type: Boolean,
    default: true,
  },
  animationDelay: {
    type: Number,
    default: 0,
  },
  animationDuration: {
    type: Number,
    default: 0.2,
  },
});

const emit = defineEmits<{ (e: 'click', p: MouseEvent): void }>();

const root = ref<SVGPathElement>(null);

onMounted(() => svgCheck(root.value));
</script>

<style lang="scss" scoped>
@use './styles';
</style>
@/types/types
