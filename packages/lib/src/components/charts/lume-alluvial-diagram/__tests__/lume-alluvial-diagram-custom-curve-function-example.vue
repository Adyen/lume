<template>
  <div style="width: 540px; height: 220px">
    <lume-alluvial-diagram
      :data="data"
      title="November expenses on my cats"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeAlluvialDiagram } from '@adyen/lume';
import { curveStep } from 'd3';

const data = [
  {
    values: [
      {
        label: 'Darcy',
        value: 'darcy',
        color: 'darkteal',
        targets: [
          { node: 'litter', value: 47, curveFunction: curveStep },
          { node: 'foodAndTreats', value: 30 },
        ],
      },
      {
        label: 'Max',
        value: 'max',
        targets: [
          { node: 'foodAndTreats', value: 31 },
          { node: 'litter', value: 34 },
          { node: 'toys', value: 34 },
        ],
      },
      {
        label: 'Food and treats',
        value: 'foodAndTreats',
      },
      {
        label: 'Litter',
        value: 'litter',
      },
      {
        label: 'Toys',
        value: 'toys',
      },
    ],
  },
];

const options = {
  valueFormat: (part: number) => `USD ${part}`,
} as const;
</script>
