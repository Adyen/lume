<template>
  <div style="width: 540px; height: 360px">
    <lume-bar-chart
      :data="data"
      :labels="labels"
      title="Life expectancy"
      orientation="vertical"
    >
      <template #tooltip="{ opened, data, hoveredIndex, targetElement }">
        <lume-tooltip
          :opened="opened"
          :items="customItemsFunction(data, hoveredIndex)"
          :target-element="targetElement"
          position="top"
        />
      </template>
    </lume-bar-chart>
  </div>
</template>

<script setup lang="ts">
import { LumeBarChart, LumeTooltip } from '@adyen/lume';
import type { Data, InternalData } from '@adyen/lume';

const data: Data = [
  {
    values: [18, 15, 9, 25, 8],
    label: 'Life expectancy',
  },
];

const labels: string[] = ['Cats', 'Dogs', 'Birds', 'Snakes', 'Frogs'];

const customItemsFunction = (data: InternalData, hoveredIndex: number) => {
  if (hoveredIndex > -1) {
    const { color, label, values } = data[0];
    return [
      {
        color,
        label,
        value: `${values[hoveredIndex].value ?? 0} years`,
      },
    ];
  }
  return [];
};
</script>
