<template>
  <div style="width: 540px; height: 360px">
    <lume-line-chart
      :data="data"
      :labels="labels"
      title="Pets met in 2023"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeLineChart } from '@adyen/lume';
import type { Data } from '@adyen/lume';

const data: Data = [
  {
    values: [15, 25, 30, null, 40, 50, 60, 12, 30],
    label: 'Cats',
  },
  {
    values: [5, 15, 20, 30, 51, 70, 180, 28, 150, 172, 200, 340],
    label: 'Dogs',
  },
  {
    values: [35, 10, 18, 50, 71, null, 100, 128, 140, 162, 180, 170],
    label: 'Birds',
  },
];

const labels: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
</script>
