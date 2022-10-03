<template>
  <LumeBarChart v-bind="props" />
</template>

<script setup lang="ts">
import LumeBarChart from '@/components/charts/lume-bar-chart';

import { withChartProps } from '@/composables/props';

const props = defineProps({
  ...withChartProps(),
});
</script>

<style lang="scss"></style>
