<template>
  <div style="width: 540px; height: 360px">
    <lume-alluvial-diagram
      :data="data"
      :labels="labels"
      title="Alluvial diagram"
      :options="options"
    />
  </div>
</template>

<script setup lang="ts">
import { LumeAlluvialDiagram } from '@adyen/lume';

const data = [];
const labels = [];

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
</script>
