<template>
  <div style="width: 540px; height: 360px">
    <lume-line-chart
      :data="data"
      :labels="labels"
      title="Cats met in 2023"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeLineChart } from '@adyen/lume';
import type { Data } from '@adyen/lume';

const data: Data = [
  {
    values: [15, 25, 30, null, null, null, null, 12, 30, 12, 344, 400],
    label: 'Cats',
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
