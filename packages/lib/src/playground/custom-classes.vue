<template>
  <LumeBarChart
    v-bind="$props"
    :class-list="classList"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import LumeBarChart from '@/components/charts/lume-bar-chart';

import { withChartProps } from '@/composables/props';

export default defineComponent({
  components: { LumeBarChart },
  props: {
    ...withChartProps(),
  },
  setup() {
    return {
      classList: ['my-custom-fill-class', 'my-custom-stroke-class'],
    };
  },
});
</script>

<style lang="scss">
$teal-10: #eef9f9;
$teal-20: #def4f4;
$teal-40: #5bc6c8;

.my-custom-fill-class {
  fill: $teal-20;

  &.lume-fill--faded {
    fill: $teal-10;
  }
}

.my-custom-stroke-class {
  stroke: $teal-40;
  stroke-width: 3px;
  stroke-dasharray: 1, 8;
  stroke-linecap: round;
}
</style>
