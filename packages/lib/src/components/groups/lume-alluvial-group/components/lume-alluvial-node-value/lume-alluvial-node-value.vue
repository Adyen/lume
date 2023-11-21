<template>
  <text
    class="lume-alluvial-group__node-value"
    :y="bottom ? '.2em' : '-.2em'"
    :dominant-baseline="bottom ? 'hanging' : 'auto'"
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
