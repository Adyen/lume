<template>
  <div style="width: 720px; height: 360px">
    <lume-alluvial-diagram
      :data="data"
      title="Yearly average pet expenses in USA"
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
        label: 'Pets',
        color: 'skyblue',
        value: 'pets',
        targets: [
          { node: 'dogs', value: 400 },
          { node: 'cats', value: 300 },
          { node: 'otherPets', value: 200 },
        ],
      },
      {
        label: 'Cats',
        color: 'royalblue',
        value: 'cats',
        targets: [
          { node: 'medicalCare', value: 50 },
          { node: 'foodAndTreats', value: 120 },
          { node: 'litter', value: 30 },
          { node: 'toys', value: 50 },
          { node: 'misc', value: 50 },
        ],
      },
      {
        label: 'Dogs (offset by 40px)',
        color: 'royalblue',
        value: 'dogs',
        targets: [
          { node: 'medicalCare', value: 100 },
          { node: 'foodAndTreats', value: 140 },
          { node: 'litter', value: 40 },
          { node: 'toys', value: 60 },
          { node: 'misc', value: 60 },
        ],
        offset: 40,
      },
      {
        label: 'Other pets (offset by 10px)',
        value: 'otherPets',
        color: 'grey',
        targets: [
          { node: 'medicalCare', value: 50 },
          { node: 'foodAndTreats', value: 40 },
          { node: 'litter', value: 10 },
          { node: 'toys', value: 60 },
          { node: 'misc', value: 40 },
        ],
        offset: 10,
      },
      {
        label: 'Medical care',
        value: 'medicalCare',
        color: 'red',
      },
      {
        label: 'Food and treats (offset by -30px)',
        value: 'foodAndTreats',
        color: 'violet',
        offset: -30,
      },
      {
        label: 'Litter',
        value: 'litter',
        color: 'darkteal',
      },
      {
        label: 'Toys',
        value: 'toys',
        color: 'gold',
      },
      {
        label: 'Misc',
        value: 'misc',
        color: 'grey',
      },
    ],
  },
];

const options = {
  valueFormat: (part: number) => `USD ${part}`,
  gradient: true,
} as const;
</script>
