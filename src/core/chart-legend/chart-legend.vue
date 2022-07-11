<template>
  <div class="u-display-flex">
    <div
      v-for="(item, index) in legend"
      :key="`legend-item-${index}`"
    >
      <span
        class="legend-circle"
        :class="`legend-circle--color-0${index + 1}`"
      >&bull;</span>
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    legend: {
      type: Array,
      required: true
    }
  },
  created() {
    console.log(this.legend);
  }
}
</script>

<style scoped lang="scss">
@use '~@/styles/variables' as *;

.legend-circle {
  @each $color, $map in $chart-colors {
    &--color-#{$color} {
      color: nth($map, 1);
    }
  }
}
</style>