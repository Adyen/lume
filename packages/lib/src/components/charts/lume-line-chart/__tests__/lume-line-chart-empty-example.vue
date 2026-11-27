<template>
  <div style="width: 540px; height: 360px">
    <lume-line-chart
      :data="data"
      :labels="labels"
      title="Line chart"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeLineChart } from '@adyen/lume';
import type { Data } from '@adyen/lume';

const data: Data = [];

const labels: string[] = [];
</script>
