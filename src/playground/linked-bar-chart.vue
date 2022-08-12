<template>
  <adv-chart
    v-bind="$props"
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

    <template #groups="props">
      <adv-bar-group
        v-bind="props"
        :data="[firstDataset]"
        :y-scale="getScale(props.yScale, 0)"
      />
      <adv-bar-group
        v-bind="props"
        :data="[secondDataset]"
        :y-scale="getScale(props.yScale, 1)"
      />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from '@vue/composition-api';

import AdvChart from '@/core/adv-chart';

import { withChartProps } from '@/mixins/props';

import { Data } from '@/types/dataset';
import AdvBarGroup from '@/core/adv-bar-group';
import AdvAxis from '@/core/adv-axis';
import { Scale } from '@/mixins/scales';

const linkedDataValidator = (data: Data) => data.length === 2;

export default defineComponent({
  components: { AdvChart, AdvBarGroup, AdvAxis },
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
