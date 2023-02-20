<template>
  <LumeBarChart v-bind="$props" />
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
    return {};
  },
});
</script>

<style lang="scss"></style>
