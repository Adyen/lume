<template>
  <div style="width: 540px; height: 360px">
    <lume-bar-chart
      :data="data"
      :labels="labels"
      title="Weekly animal encounter"
      orientation="vertical"
      type="stacked"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeBarChart } from '@adyen/lume';
import type { Data } from '@adyen/lume';

const data: Data = [
  {
    label: 'Cats',
    values: [10, 70, 25, 35],
  },
  {
    label: 'Dogs',
    values: [30, 20, 10, 25],
  },
  {
    label: 'Birds',
    values: [60, 70, 25],
  },
];

const labels: string[] = ['NL', 'India', 'UK', 'France'];
</script>
