<template>
  <g>
    <bar
        v-for="(bar, index) in bars"
        :key="`bar-${index}`"
        v-bind="bar"
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
import Bar from '../core/bar.vue';

export default {
  components: { Bar },
  props: {
    bars: {
      type: Array,
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
  },
}
</script>