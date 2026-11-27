<template>
  <svg
    :width="width"
    :height="height"
  >
    <g>
      <LumeAxis
        :width="width"
        :height="height"
        type="x"
        :scale="scale"
        :container-size="containerSize"
        :options="options"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { scaleBand } from 'd3';
import { type AxisOptions, LumeAxis } from '@adyen/lume';

const width = 540;
const height = 200;
const bottomMargin = 32;
const containerSize = { width, height: height - bottomMargin };
const scale = scaleBand()
  .domain(['0', '1', '2', '3', '4', '5', '6'])
  .range([0, width]);
const options: AxisOptions = {
  gridLines: true,
  withTitle: false,
  showTicks: true,
  tickCount: 10,
  tickFormat: null,
  tickPadding: 12,
  tickAlign: 'end',
  skip: true,
};
</script>
