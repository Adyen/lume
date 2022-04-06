<template>
  <g>
    <bar v-bind="bar" />
    <bar
        v-if="overlay"
        v-bind="overlay"
        :fill="`rgba(0, 0, 0, ${isHovered ? .3 : 0})`"
        @mouseover.native="$emit('mouseover', $event)"
        @mouseout.native="$emit('mouseout')"
    />
  </g>
</template>

<script>
import Bar from './bar.vue';

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
    }
  }
}
</script>
