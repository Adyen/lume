<template>
  <text
    class="lume-alluvial-group__node-label"
    :dy="bottom ? '1.2em' : ''"
  >
    <slot />
  </text>
</template>

<script lang="ts" setup>
defineProps({
  bottom: { type: Boolean, default: false },
});
</script>

<style lang="scss" scoped>
@use '../../styles';
</style>
