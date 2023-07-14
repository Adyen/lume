<template>
  <text
    class="lume-alluvial-group__node-value"
    :dy="bottom ? '1.2em' : ''"
  >
    <slot />
  </text>
</template>

<script lang="ts" setup>
defineProps({
  bottom: { type: Boolean, default: true },
});
</script>

<style lang="scss" scoped>
@use '../../styles';
</style>
