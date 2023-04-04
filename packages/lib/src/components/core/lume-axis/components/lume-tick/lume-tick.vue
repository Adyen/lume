<template>
  <g
    v-bind="group"
    class="axis__tick"
    :class="{
      'axis__tick--hovered': isHovered,
      'axis__tick--hidden': isHidden,
    }"
    data-j-axis__tick
    @mouseover="emit('mouseover')"
  >
    <g
      class="axis__tick-label lume-typography--axis"
      pointer-events="all"
      data-j-axis__tick-label
    >
      <rect
        v-bind="ghost"
        class="axis__ghost"
        fill="url(#lume-tick-gradient)"
      />
      <text
        v-bind="label"
        ref="labelRef"
        class="axis__label"
      >
        {{ value }}
      </text>
    </g>

    <line
      v-if="withGridlines"
      v-bind="gridline"
      class="axis__grid-line"
    />
  </g>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';

import { AxisMixinFunction } from '../../types';

defineProps({
  value: {
    type: [String, Number],
    required: true,
  },
  group: {
    type: Object as PropType<ReturnType<AxisMixinFunction>>,
    required: true,
  },
  ghost: {
    type: Object as PropType<ReturnType<AxisMixinFunction>>,
    required: true,
  },
  label: {
    type: Object as PropType<ReturnType<AxisMixinFunction>>,
    required: true,
  },
  gridline: {
    type: Object as PropType<ReturnType<AxisMixinFunction>>,
    required: true,
  },
  isHovered: {
    type: Boolean,
    default: false,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
  withGridlines: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{ (e: 'mouseover'): void }>(); // Needs to be emitted for Vue 2

const labelRef = ref<SVGTextElement>(null);

defineExpose({ ref: labelRef });
</script>

<style lang="scss" scoped>
@use './styles';
</style>
