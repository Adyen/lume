<template>
  <rect
    class="bar"
    :x="x"
    :y="y"
    :height="height"
    :width="width"
    :class="[fillClass, { 'bar--transition': animate }]"
  />
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    fillClass: {
      type: String,
      required: true
    },
    animate: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@use "~@/styles/variables" as *;

.bar {
  &--transition {
    transition: all $chart-transition-time ease;
  }
}
</style>
