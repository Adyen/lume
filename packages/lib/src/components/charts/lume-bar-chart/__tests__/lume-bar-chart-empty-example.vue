<template>
  <div style="width: 540px; height: 360px">
    <lume-bar-chart
      :data="data"
      :labels="labels"
      type="grouped"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeBarChart } from '@adyen/lume';
import type { Data } from '@adyen/lume';

const data: Data = [];

const labels: string[] = [];
</script>
