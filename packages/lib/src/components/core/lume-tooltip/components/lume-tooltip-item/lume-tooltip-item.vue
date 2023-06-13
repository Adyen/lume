<template>
  <li
    class="lume-tooltip__item"
    data-j-tooltip__item
  >
    <span
      v-if="color"
      :class="[`lume-background-color--${color}`]"
      class="lume-tooltip__symbol"
      data-j-tooltip__item__symbol
    />
    <span data-j-tooltip__item__label>
      <slot name="label" />
    </span>
    <strong
      class="lume-tooltip__value"
      data-j-tooltip__item__value
    >
      <slot name="value" />
    </strong>
  </li>
</template>

<script lang="ts" setup>
defineProps({
  color: {
    type: String,
    default: null,
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
