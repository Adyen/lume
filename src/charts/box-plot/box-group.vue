<template>
  <g>
    <line
      class="box-plot__line"
      v-bind="boxGroup.verticalLine"
    />
    <rect
      class="box-plot__box"
      v-bind="boxGroup.box"
    />
    <line
      class="box-plot__median"
      v-bind="boxGroup.medianLine"
    />
    <bar
      v-if="overlay"
      v-bind="overlay"
      :fill-class="isHovered ? 'adv-fill-color-overlay' : 'adv-fill-color-transparent'"
      :animate="true"
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
    boxGroup: {
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

<style scoped lang="scss">
@use "~@/styles/variables" as *;

.box-plot {
  &__line {
    stroke: $adv-color-data-viz-grey-darker;
    width: 40px;
  }
  &__box {
    fill: $adv-color-data-viz-yellow;
    stroke: $adv-color-data-viz-grey-darker;
  }
  &__median {
    stroke: $adv-color-data-viz-grey-darker;
    width: 80px;
  }
}
</style>