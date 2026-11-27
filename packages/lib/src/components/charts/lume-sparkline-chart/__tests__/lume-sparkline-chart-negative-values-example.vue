<template>
  <div style="width: 300px; height: 80px">
    <lume-sparkline-chart :data="data" />
  </div>
</template>

<script setup lang="ts">
import { LumeSparklineChart } from '@adyen/lume';

const data = [
  {
    values: [10, 15, 8, -4, -1, 4, 20],
    color: '09',
    label: 'Member count',
  },
];
</script>
