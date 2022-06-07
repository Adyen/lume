<template>
  <g>
    <bar
      v-bind="bar"
      :animate="animate"
    />
    <bar
      v-if="overlay"
      v-bind="overlay"
      :fill-class="isHovered ? 'adv-fill-color-overlay' : 'adv-fill-color-transparent'"
      :animate="false"
      @mouseover.native="$emit('mouseover', $event)"
      @mouseout.native="$emit('mouseout')"
    />
  </g>
</template>

<script>
import Bar from '@/core/bar.vue';

export default {
  components: { Bar },
  props: {
    bar: {
      type: Object,
      required: true
    },
    overlay: {
      type: Object,
      default: null
    },
    isHovered: {
      type: Boolean,
      required: true
    },
    animate: {
      type: Boolean,
      default: false
    }
  }
}
</script>
