<template>
  <g :transform="`translate(${x}, ${y})`">
    <g :transform="beforeTransform">
      <slot name="before" />
    </g>
    <text
      ref="textRef"
      class="lume-alluvial-group__node-header lume-typography--caption"
      :class="{
        [`lume-alluvial-group__node-header--${align}`]: align !== 'center',
      }"
    >
      <slot />
    </text>
    <g :transform="afterTransform">
      <slot name="after" />
    </g>
  </g>
</template>

<script lang="ts" setup>
import { computed, PropType, ref } from 'vue';

import type { AlluvialNodeHeaderAlignment } from '@/types/alluvial';

const props = defineProps({
  align: {
    type: String as PropType<AlluvialNodeHeaderAlignment>,
    default: 'center',
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const textRef = ref<SVGGraphicsElement>(null);

const textWidth = computed(() => textRef.value?.getBBox().width ?? 0);

// Horizontal offset of the text's left edge, which depends on its alignment
const textStart = computed(() => {
  if (props.align === 'left') return 0;
  if (props.align === 'right') return -textWidth.value;
  return -textWidth.value / 2;
});

const beforeTransform = computed(
  () => textRef.value && `translate(${textStart.value}, 0)`
);
const afterTransform = computed(
  () => textRef.value && `translate(${textStart.value + textWidth.value}, 0)`
);
</script>

<style lang="scss" scoped>
@use '../../styles';
</style>
