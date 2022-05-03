<template>
  <g :transform="transform" class="bar" :class="{ 'bar--transition': animate }">
    <rect :height="height" :width="width" :class="[fillClass, { 'bar--transition': animate }]" />
  </g>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    transform: {
      type: String,
      required: true
    },
    fillClass: {
      type: String,
      required: true
    },
    animate: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.bar {
  &--transition {
    transition: all $chart-transition-time ease;
  }
}
</style>
