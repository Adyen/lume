<template>
  <svg
    :width="width"
    :height="height"
  >
    <g :transform="`translate(${leftMargin}, ${topMargin})`">
      <LumeAxis
        :width="width"
        :height="height"
        type="x"
        :scale="xScale"
        :container-size="containerSize"
        :options="options"
      />
      <LumeAxis
        :width="width"
        :height="height"
        type="y"
        :scale="yScale"
        :container-size="containerSize"
        :options="options"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { scaleBand, scaleLinear } from 'd3';
import { type AxisOptions, LumeAxis } from '@adyen/lume';

const width = 540;
const height = 200;
const leftMargin = 36;
const topMargin = 14;
const bottomMargin = 32;
const containerSize = {
  width: width - leftMargin,
  height: height - topMargin - bottomMargin,
};
const xScale = scaleBand()
  .domain(['0', '1', '2', '3', '4', '5', '6'])
  .range([0, width - leftMargin]);
const yScale = scaleLinear()
  .domain([0, 100])
  .range([height - topMargin - bottomMargin, 0]);
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
