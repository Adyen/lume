<template>
  <div style="width: 540px; height: 360px">
    <lume-line-chart
      :data="data"
      :labels="labels"
      title="Pets met in 2023"
      :options="options"
    >
      <template
        #tooltip="{
          opened,
          data,
          hoveredIndex,
          targetElement,
          handleMouseEnter,
          handleMouseLeave,
        }"
      >
        <lume-tooltip
          :opened="opened"
          :items="customItemsFunction(data, hoveredIndex)"
          :target-element="targetElement"
          :options="options.tooltipOptions"
          position="top"
          @tooltip-mouseenter="handleMouseEnter"
          @tooltip-mouseleave="handleMouseLeave"
        >
          <template #title>
            <button @click="showSummary = !showSummary">
              <template v-if="showSummary">
                Hide
              </template>
              <template v-else>
                Show
              </template> additional information
            </button>
          </template>
          <template #summary>
            <lume-tooltip-summary v-show="showSummary">
              Total number of pets: {{ computeTotal(data, hoveredIndex) }}
            </lume-tooltip-summary>
          </template>
        </lume-tooltip>
      </template>
    </lume-line-chart>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LumeLineChart, LumeTooltip, LumeTooltipSummary } from '@adyen/lume';
import type { Data, InternalData, LineChartOptions } from '@adyen/lume';

const data: Data = [
  {
    values: [15, 25, 30, null, 40, 50, 60, 12, 30],
    label: 'Cats',
  },
  {
    values: [5, 15, 20, 30, 51, 70, 180, 28, 150, 172, 200, 340],
    label: 'Dogs',
  },
  {
    values: [35, 10, 18, 50, 71, null, 100, 128, 140, 162, 180, 170],
    label: 'Birds',
  },
];

const labels: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const options: LineChartOptions = {
  tooltipOptions: {
    withPointerEvents: true,
  },
};

const showSummary = ref(false);

const customItemsFunction = (data: InternalData, hoveredIndex: number) => {
  if (hoveredIndex > -1) {
    return data.map((item) => ({
      ...item,
      value: item.values[hoveredIndex]?.value ?? 0,
    }));
  }
  return [];
};

const computeTotal = (data: InternalData, hoveredIndex: number) => {
  if (hoveredIndex > -1) {
    return data.reduce(
      (acc, current) => acc + (current.values[hoveredIndex]?.value ?? 0),
      0
    );
  }
  return 0;
};
</script>
