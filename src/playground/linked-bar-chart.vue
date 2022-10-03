<template>
  <adv-chart
    v-bind="props"
    chart-type="bar"
  >
    <template #axes="{ xScale, yScale, containerSize, options, hoveredIndex }">
      <adv-axis
        type="y"
        :scale="getScale(yScale, 0)"
        :container-size="containerSize"
        :options="options.yAxisOptions"
      />
      <adv-axis
        type="y"
        :scale="getScale(yScale, 1)"
        :container-size="containerSize"
        :options="options.yAxisOptions"
      />

      <adv-axis
        type="x"
        :scale="xScale"
        :container-size="containerSize"
        :options="options.xAxisOptions"
        :hovered-index="hoveredIndex"
      />
    </template>

    <template #groups="groupProps">
      <adv-bar-group
        v-bind="groupProps"
        :data="[firstDataset]"
        :y-scale="getScale(groupProps.yScale, 0)"
      />
      <adv-bar-group
        v-bind="groupProps"
        :data="[secondDataset]"
        :y-scale="getScale(groupProps.yScale, 1)"
      />
    </template>
  </adv-chart>
</template>
<script lang="ts">
const linkedDataValidator = (data: Data) => data.length === 2;
</script>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import AdvAxis from '@/core/adv-axis';
import AdvChart from '@/core/adv-chart';
import AdvBarGroup from '@/groups/adv-bar-group';

import { Scale } from '@/composables/scales';
import { withChartProps } from '@/composables/props';

import { Data } from '@/types/dataset';

const props = defineProps({
  ...withChartProps(linkedDataValidator),
});

const { data } = toRefs(props);

const firstDataset = computed(() => data.value[0]);
const secondDataset = computed(() => data.value[1]);

function getScale(scale: Scale, index: number) {
  if (!scale) return scale;
  const max = Math.max(...scale.range());
  const half = max / 2;

  return scale.copy().range(index === 0 ? [0, half - 22] : [half + 22, max]);
}
</script>

<style lang="scss"></style>
