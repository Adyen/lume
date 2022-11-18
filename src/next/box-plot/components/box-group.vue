<template>
  <g>
    <line
      class="box-plot__line"
      v-bind="boxGroup.verticalLine"
    />
    <rect
      class="box-plot__box"
      v-bind="boxGroup.box"
      :class="[`lume-fill--${boxGroup.color}`]"
    />
    <line
      class="box-plot__median"
      v-bind="boxGroup.medianLine"
    />
    <lume-bar
      v-if="overlay"
      v-bind="overlay"
      :class-list="isHovered ? 'lume-fill--overlay' : 'lume-fill--transparent'"
      :transition="true"
      @mouseover.native="$emit('mouseover', $event)"
      @mouseout.native="$emit('mouseout')"
    />
  </g>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import LumeBar from '@/components/core/lume-bar';

export default defineComponent({
  components: { LumeBar },
  props: {
    boxGroup: {
      type: Object,
      required: true,
    },
    overlay: {
      type: Object,
      default: null,
    },
    isHovered: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.box-plot {
  &__line {
    stroke: $lume-color-data-viz-grey-darker;
    width: 40px;
  }
  &__box {
    stroke: $lume-color-data-viz-grey-darker;
  }
  &__median {
    stroke: $lume-color-data-viz-grey-darker;
    width: 80px;
  }
}
</style>
