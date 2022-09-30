<template>
  <lume-chart
    v-bind="$props"
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

    <template #groups="props">
      <lume-bar-group
        v-bind="props"
        :data="[firstDataset]"
        :y-scale="getScale(props.yScale, 0)"
      />
      <lume-bar-group
        v-bind="props"
        :data="[secondDataset]"
        :y-scale="getScale(props.yScale, 1)"
      />
    </template>
  </lume-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import LumeAxis from '@/core/lume-axis';
import LumeChart from '@/core/lume-chart';
import LumeBarGroup from '@/groups/lume-bar-group';

import { Scale } from '@/composables/scales';
import { withChartProps } from '@/composables/props';

import { Data } from '@/types/dataset';

const linkedDataValidator = (data: Data) => data.length === 2;

export default defineComponent({
  components: { LumeChart, LumeBarGroup, LumeAxis },
  props: {
    ...withChartProps(linkedDataValidator),
  },
  setup(props) {
    const { data } = toRefs(props);

    const firstDataset = computed(() => data.value[0]);
    const secondDataset = computed(() => data.value[1]);

    function getScale(scale: Scale, index: number) {
      if (!scale) return scale;
      const max = Math.max(...scale.range());
      const half = max / 2;

      return scale
        .copy()
        .range(index === 0 ? [0, half - 22] : [half + 22, max]);
    }

    return { firstDataset, secondDataset, getScale };
  },
});
</script>

<style lang="scss"></style>
