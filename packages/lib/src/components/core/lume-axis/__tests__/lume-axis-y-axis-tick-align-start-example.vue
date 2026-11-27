<template>
  <svg
    :width="width"
    :height="height"
  >
    <g :transform="`translate(${leftMargin}, ${verticalMargin})`">
      <LumeAxis
        :width="width"
        :height="height"
        type="y"
        :scale="scale"
        :container-size="containerSize"
        :options="options"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { scaleLinear } from 'd3';
import { type AxisOptions, LumeAxis } from '@adyen/lume';

const width = 540;
const height = 200;
const leftMargin = 52;
const verticalMargin = 14;
const containerSize = {
  width: width - leftMargin,
  height: height - verticalMargin * 2,
};
const scale = scaleLinear()
  .domain([0, 10000])
  .range([height - verticalMargin * 2, 0]);
const options: AxisOptions = {
  gridLines: true,
  withTitle: true,
  showTicks: true,
  tickCount: 10,
  tickFormat: null,
  tickPadding: 12,
  tickAlign: 'start',
};
</script>
