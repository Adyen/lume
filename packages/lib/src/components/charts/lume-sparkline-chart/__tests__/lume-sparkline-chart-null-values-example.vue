<template>
  <div style="width: 300px; height: 80px">
    <lume-sparkline-chart :data="data" />
  </div>
</template>

<script setup lang="ts">
import { LumeSparklineChart } from '@adyen/lume';

const data = [
  {
    values: [30, null, 40, 50, null, null, 60, 20, 10, null],
    color: 'violet',
    label: 'Pets adopted',
  },
];
</script>
