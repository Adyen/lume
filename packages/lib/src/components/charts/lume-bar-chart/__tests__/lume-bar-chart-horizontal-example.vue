<template>
  <div style="width: 540px">
    <lume-bar-chart
      :data="data"
      :labels="labels"
      title="Life expectancy"
      orientation="horizontal"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeBarChart } from '@adyen/lume';
import type { Data } from '@adyen/lume';

const data: Data = [
  {
    values: [18, 15, 9, 25, 8],
    label: 'Life expectancy',
  },
];

const labels: string[] = ['Cats', 'Dogs', 'Birds', 'Snakes', 'Frogs'];
</script>
