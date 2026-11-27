<template>
  <div style="width: 540px; height: 360px">
    <lume-bar-chart
      :data="data"
      :labels="labels"
      title="Money spent on cats"
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
    label: 'Spent on cats',
    values: [10000, 2000, 15000, 0.5, null, 18000],
  },
];

const labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const options: BarChartOptions = {
  tooltipOptions: {
    valueFormat: (value) => (value !== 'No data' ? `EUR ${value}` : value),
  },
  withLegend: false,
};
</script>
