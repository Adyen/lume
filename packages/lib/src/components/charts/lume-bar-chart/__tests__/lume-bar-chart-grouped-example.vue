<template>
  <div style="width: 540px; height: 360px">
    <lume-bar-chart
      :data="data"
      :labels="labels"
      title="Adopted animals"
      orientation="vertical"
      type="grouped"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeBarChart } from '@adyen/lume';
import type { Data } from '@adyen/lume';

const data: Data = [
  {
    label: 'Cats',
    values: [11000, 12000, 4000, 15000],
  },
  {
    label: 'Dogs',
    values: [5000, 8000, 2000, 4000],
  },
  {
    label: 'Horses',
    values: [500, 11000, 1000],
  },
];

const labels: string[] = ['Jan', 'Feb', 'Mar', 'Apr'];
</script>
