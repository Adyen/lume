<template>
  <rect
    class="bar"
    :x="x"
    :y="y"
    :height="computedHeight"
    :width="width"
    :class="[fillClass, { 'bar--transition': animate }]"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
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
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    transform: {
      type: String,
      required: true,
    },
    fillClass: {
      type: String,
      required: true,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const computedHeight = computed(() => {
      return props.height === 0 ? 1 : props.height;
    });
    return { computedHeight };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

.bar {
  &--transition {
    transition: all $chart-transition-time ease;
  }
}
</style>
