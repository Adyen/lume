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
        label: 'Dogs',
        color: 'royalblue',
        value: 'dogs',
        targets: [
          { node: 'medicalCare', value: 100 },
          { node: 'foodAndTreats', value: 140 },
          { node: 'litter', value: 40 },
          { node: 'toys', value: 60 },
          { node: 'misc', value: 60 },
        ],
      },
      {
        label: 'Other pets',
        value: 'otherPets',
        color: 'grey',
        targets: [
          { node: 'birds', value: 80 },
          { node: 'fish', value: 70 },
          { node: 'reptiles', value: 50 },
        ],
        expandableNodes: ['birds', 'fish', 'reptiles'],
      },
      {
        label: 'Birds',
        value: 'birds',
        color: 'grey',
        targets: [
          { node: 'medicalCare', value: 25 },
          { node: 'foodAndTreats', value: 20 },
          { node: 'litter', value: 5 },
          { node: 'toys', value: 20 },
          { node: 'misc', value: 10 },
        ],
      },
      {
        label: 'Fish',
        value: 'fish',
        color: 'grey',
        targets: [
          { node: 'medicalCare', value: 15 },
          { node: 'foodAndTreats', value: 10 },
          { node: 'litter', value: 5 },
          { node: 'toys', value: 25 },
          { node: 'misc', value: 15 },
        ],
      },
      {
        label: 'Reptiles',
        value: 'reptiles',
        color: 'grey',
        targets: [
          { node: 'medicalCare', value: 10 },
          { node: 'foodAndTreats', value: 10 },
          { node: 'toys', value: 15 },
          { node: 'misc', value: 15 },
        ],
      },
      {
        label: 'Medical care',
        value: 'medicalCare',
        color: 'red',
      },
      {
        label: 'Food and treats',
        value: 'foodAndTreats',
        color: 'violet',
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
