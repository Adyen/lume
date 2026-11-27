<template>
  <div style="width: 300px; height: 80px">
    <lume-sparkline-chart
      :data="data"
      :labels="labels"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeSparklineChart } from '@adyen/lume';

const data = [];
const labels = [];
</script>
