<template>
  <rect
    class="bar"
    :x="x"
    :y="y"
    :height="height"
    :width="width"
    :class="[fillClass, { 'bar--transition': animate, 'bar--faded': isFaded }]"
    data-j-bar
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    fillClass: {
      type: String,
      required: true,
    },
    isFaded: {
      type: Boolean,
      default: false,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
