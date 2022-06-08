<template>
  <g>
    <bar
      v-for="(bar, index) in bars"
      :key="`bar-${index}`"
      v-bind="bar"
      :animate="animate"
    />
    <bar
      v-if="overlay"
      v-bind="overlay"
      :fill-class="
        isHovered ? 'adv-fill-color-overlay' : 'adv-fill-color-transparent'
      "
      animate
      @mouseover.native="$emit('mouseover', $event)"
      @mouseout.native="$emit('mouseout')"
    />
  </g>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import Bar from './bar';

export default defineComponent({
  components: { Bar },
  props: {
    bars: {
      type: Array,
      required: true,
    },
    overlay: {
      type: Object,
      default: null,
    },
    isHovered: {
      type: Boolean,
      required: true
    },
    animate: {
      type: Boolean,
      default: false
    }
  },
});
</script>
