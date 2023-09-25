<template>
  <li
    class="lume-tooltip__item"
    data-j-tooltip__summary-item
  >
    <span>
      <slot />
    </span>
    <strong class="lume-tooltip__value">
      <slot name="value" />
    </strong>
  </li>
</template>

<style lang="scss" scoped>
@use '../../styles';
</style>
