<template>
  <AdvBarChart v-bind="$props" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { AdvBarChart } from '@/charts';

import { withChartProps } from '@/composables/props';

export default defineComponent({
  components: { AdvBarChart },
  props: {
    ...withChartProps(),
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss"></style>
