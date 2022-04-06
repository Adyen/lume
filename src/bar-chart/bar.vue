<template>
  <g
      :transform="transform"
      class="transition"
  >
    <rect
        :height="height"
        :width="width"
        :fill="fill"
        class="transition"
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
    }
  }
}
</script>

<style>
.transition {
  transition: all 1s;
}
</style>
