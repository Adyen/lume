<template>
  <div style="width: 540px; height: 360px">
    <lume-alluvial-diagram
      :data="data"
      title="Students performance in science exam"
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
        label: 'Students from the University of Amsterdam',
        color: 'skyblue',
        value: 'students',
        targets: [
          { node: 'passed', value: 60 },
          { node: 'retriedExam', value: 50 },
          { node: 'skipped', value: 0 },
        ],
      },
      {
        label: 'Retried exam',
        color: 'skyblue',
        value: 'retriedExam',
        targets: [
          { node: 'failed', value: 10, color: 'red' },
          { node: 'passed', value: 40 },
        ],
      },
      {
        label: 'Passed',
        color: 'skyblue',
        value: 'passed',
      },
      {
        label: 'Failed',
        color: 'red',
        value: 'failed',
      },
      {
        label: 'Skipped',
        value: 'skipped',
      },
    ],
  },
];

const options = {
  nodeLabelMaxWidth: 100,
} as const;
</script>
