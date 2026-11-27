<template>
  <div style="width: 540px; height: 360px">
    <lume-alluvial-diagram
      :data="data"
      title="Students performance in science exam"
      :options="options"
    >
      <template #node-text-students="{ node }">
        <tspan
          style="cursor: pointer"
          @mouseenter="targetElement = $event.target as Element"
          @mouseleave="targetElement = null"
        >
          ℹ️
        </tspan>
        <lume-alluvial-node-label dx="4">
          Custom label
        </lume-alluvial-node-label>
        <lume-alluvial-node-value>
          <tspan style="font-style: italic; fill: green">
            +{{
              Math.round((node.transitionValue || node.value) * 0.12 * 100) /
                100
            }}%
          </tspan>
          {{ node.transitionValue || node.value }}
        </lume-alluvial-node-value>
      </template>
      <template #tooltip="props">
        <lume-tooltip
          v-bind="props"
          :opened="!!targetElement"
          :target-element="targetElement"
        >
          Some additional info about the node.
        </lume-tooltip>
      </template>
    </lume-alluvial-diagram>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  LumeAlluvialDiagram,
  LumeAlluvialNodeLabel,
  LumeAlluvialNodeValue,
  LumeTooltip,
} from '@adyen/lume';

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
  margins: { top: 0, right: 0, bottom: 0, left: 0 },
  withAxes: false,
  withTooltip: false,
  withHover: false,
  withLegend: false,
  alignFirstNodeLabels: 'left',
  alignLastNodeLabels: 'right',
  gradient: false,
  highlightedElements: 'closest',
  nodePadding: 16,
  nodeWidth: 16,
  nodeExpansionTrigger: 'node',
  iterations: 6,
} as const;

const targetElement = ref<Element | null>(null);
</script>
