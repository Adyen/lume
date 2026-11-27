<template>
  <div style="width: 540px; height: 360px">
    <lume-line-chart
      :data="data"
      :labels="labels"
      title="Dogs petted over time"
      :options="options"
    >
      <template #tooltip="{ opened, data, hoveredIndex, targetElement }">
        <lume-tooltip
          :opened="opened"
          :items="customItemsFunction(data, hoveredIndex)"
          :target-element="targetElement"
          position="top"
        />
      </template>
    </lume-line-chart>
  </div>
</template>

<script setup lang="ts">
import { LumeLineChart, LumeTooltip } from '@adyen/lume';
import type { Data, InternalData, LineChartOptions } from '@adyen/lume';

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

const options: LineChartOptions = {
  yAxisOptions: {
    skip: 2,
  },
  xAxisOptions: {
    skip: 2,
  },
};

const customItemsFunction = (data: InternalData, hoveredIndex: number) => {
  if (hoveredIndex > -1) {
    const { color, label, values } = data[0];
    return [
      {
        color,
        label,
        value: `${values[hoveredIndex].value ?? 0} dogs`,
      },
    ];
  }
  return [];
};
</script>
