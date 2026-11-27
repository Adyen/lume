<template>
  <div style="width: 540px; height: 360px">
    <lume-alluvial-diagram
      :data="data"
      title="Color derivation from incoming links"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeAlluvialDiagram } from '@adyen/lume';

const data = [
  {
    values: [
      {
        value: 'A',
        targets: [
          { node: 'C', value: 20 },
          { node: 'D', value: 15 },
        ],
      },
      {
        value: 'B',
        targets: [{ node: 'D', value: 10 }],
      },
      {
        label: 'C',
        value: 'C',
        targets: [
          { node: 'E', value: 15 },
          { node: 'F', value: 5 },
        ],
      },
      {
        label: 'D',
        value: 'D',
        targets: [{ node: 'F', value: 25 }],
      },
      {
        label: 'E',
        value: 'E',
        color: 'royalblue',
        targets: [
          { node: 'G', value: 10 },
          { node: 'H', value: 5, color: 'darkteal' },
        ],
      },
      {
        label: 'F',
        value: 'F',
        color: 'red',
        targets: [
          { node: 'G', value: 10 },
          { node: 'H', value: 20, color: 'darkteal' },
        ],
      },
      {
        label: 'G',
        value: 'G',
        deriveColorFromIncomingLinks: true,
      },
      {
        label: 'H',
        value: 'H',
        color: 'darkteal',
      },
    ],
  },
];

const options = {
  gradient: true,
} as const;
</script>
