<template>
  <g :transform="`translate(${x}, ${y})`">
    <g :transform="beforeTransform">
      <slot name="before" />
    </g>
    <text
      ref="textRef"
      class="lume-alluvial-group__node-header lume-typography--caption"
    >
      <slot />
    </text>
    <g :transform="afterTransform">
      <slot name="after" />
    </g>
  </g>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const textRef = ref<SVGGraphicsElement>(null);

const beforeTransform = computed(
  () => textRef.value && `translate(${-textRef.value.getBBox().width / 2}, 0)`
);
const afterTransform = computed(
  () => textRef.value && `translate(${textRef.value.getBBox().width / 2}, 0)`
);
</script>

<style lang="scss" scoped>
@use '../../styles';
</style>
