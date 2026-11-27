<template>
  <div style="width: 540px; height: 360px">
    <lume-bar-chart
      :data="data"
      :labels="labels"
      title="Dogs petted over time"
      orientation="vertical"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeBarChart } from '@adyen/lume';
import type { BarChartOptions, Data } from '@adyen/lume';

const data: Data = [
  {
    values: [60, 80, 70, 30, 60, 90, 120, 220, 170, 190, 150, 80, 100, 125, 70],
    label: 'Dogs',
  },
];

const labels: string[] = [
  'Jan 1',
  'Jan 2',
  'Jan 3',
  'Jan 4',
  'Jan 5',
  'Jan 6',
  'Jan 7',
  'Jan 8',
  'Jan 9',
  'Jan 10',
  'Jan 11',
  'Jan 12',
  'Jan 13',
  'Jan 14',
  'Jan 15',
];

const options: BarChartOptions = {
  xAxisOptions: {
    skip: 1,
  },
};
</script>
