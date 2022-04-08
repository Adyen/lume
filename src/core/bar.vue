<template>
  <g
      :transform="transform"
      :class="{ 'transition': animate }"
  >
    <rect
        :height="height"
        :width="width"
        :fill="fill"
        :class="{ 'transition': animate }"
    />
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
    fill: {
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

<style>
.transition {
  transition: all 1s;
}
</style>
