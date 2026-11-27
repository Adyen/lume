<template>
  <LumeChartLegend :data="internalData" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LumeChartLegend, useBase } from '@adyen/lume';

const data = ref([
  {
    values: [60, 80, 70, 30, 60, 90, 120, 220, 170, 190, 150, 80, 100, 125, 70],
    label: 'Dogs',
  },
]);

const { internalData } = useBase(data);
</script>
