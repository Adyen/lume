<template>
  <lume-chart
    v-bind="props"
    chart-type="bar"
  >
    <template #axes="{ xScale, yScale, containerSize, options, hoveredIndex }">
      <lume-axis
        type="y"
        :scale="getScale(yScale, 0)"
        :container-size="containerSize"
        :options="options.yAxisOptions"
      />
      <lume-axis
        type="y"
        :scale="getScale(yScale, 1)"
        :container-size="containerSize"
        :options="options.yAxisOptions"
      />

      <lume-axis
        type="x"
        :scale="xScale"
        :container-size="containerSize"
        :options="options.xAxisOptions"
        :hovered-index="hoveredIndex"
      />
    </template>

    <template #groups="groupsProps">
      <lume-bar-group
        v-bind="groupsProps"
        :data="firstDataset"
        :y-scale="getScale(groupsProps.yScale, 0)"
      />
      <lume-bar-group
        v-bind="groupsProps"
        :data="secondDataset"
        :y-scale="getScale(groupsProps.yScale, 1)"
      />
    </template>
  </lume-chart>
</template>

<script lang="ts">
const linkedDataValidator = (data: Data) => data.length === 2;
</script>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import LumeAxis from '@/components/core/lume-axis';
import LumeChart from '@/components/core/lume-chart';
import LumeBarGroup from '@/components/groups/lume-bar-group';
import { Scale } from '@/composables/scales';
import { withChartProps } from '@/composables/props';
import { Data } from '@/types/dataset';
import { useBase } from '@/composables/base';

const props = defineProps({
  ...withChartProps(linkedDataValidator),
});

const { data } = toRefs(props);
const firstDataset = computed(
  () => useBase(ref([data.value[0]])).internalData.value
);
const secondDataset = computed(
  () => useBase(ref([data.value[1]])).internalData.value
);
function getScale(scale: Scale, index: number) {
  if (!scale) return scale;
  const max = Math.max(...scale.range());
  const half = max / 2;
  return scale
    .copy()
    .range(index === 0 ? [0, half - 22] : [half + 22, max]);
}
</script>

<style lang="scss"></style>