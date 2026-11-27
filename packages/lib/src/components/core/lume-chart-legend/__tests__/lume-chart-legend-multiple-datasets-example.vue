<template>
  <LumeChartLegend :data="internalData" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LumeChartLegend, useBase } from '@adyen/lume';

const data = ref([
  {
    label: 'Cats',
    values: [11000, 12000, 4000, 15000],
  },
  {
    label: 'Dogs',
    values: [5000, 8000, 2000, 4000],
  },
  {
    label: 'Horses',
    values: [500, 11000, 1000],
  },
]);

const { internalData } = useBase(data);
</script>
