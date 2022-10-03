<template>
  <AdvBarChart v-bind="props" />
</template>

<script setup lang="ts">
import AdvBarChart from '@/charts/adv-bar-chart';

import { withChartProps } from '@/composables/props';

const props = defineProps({
  ...withChartProps(),
});
</script>

<style lang="scss"></style>
