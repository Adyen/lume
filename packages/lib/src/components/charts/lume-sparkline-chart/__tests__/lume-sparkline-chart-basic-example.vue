<template>
  <div style="width: 300px; height: 80px">
    <lume-sparkline-chart :data="data" />
  </div>
</template>

<script setup lang="ts">
import { LumeSparklineChart } from '@adyen/lume';

const data = [
  {
    values: [12, 14, 8, 10, 20, 9, 8, 4, 12, 0, 15, 8, 9, 10],
    label: 'Cat adoptions in Dec 2022',
  },
];
</script>
