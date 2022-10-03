<template>
  <adv-chart
    v-bind="props"
    chart-type="line"
    :options="getSparklineOptions(allOptions)"
    :x-scale="xScaleGenerator"
  >
    <template #groups="groupProps">
      <path
        v-if="allOptions.showArea"
        :class="[
          'sparkline-chart__area',
          `adv-fill--${areaColor || computedColor}`,
          'adv-fill--faded',
        ]"
        :d="areaPathDefinition(groupProps.xScale, groupProps.yScale)"
        data-j-sparkline__area
      />

      <adv-line-group
        v-bind="groupProps"
        :with-points="false"
      />
    </template>
  </adv-chart>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { scaleLinear } from 'd3-scale';

import AdvChart from '@/core/adv-chart';
import AdvLineGroup from '@/groups/adv-line-group';

import { useBase, withBase } from '@/composables/base';
import { Options, useOptions, withOptions } from '@/composables/options';
import { useLineNullValues } from '@/composables/line-null-values';
import { useSparklineArea } from './composables/sparkline-area';

import { Data } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withBase(null),
  ...withOptions(),
});

const { data, options } = toRefs(props);

const { internalData } = useBase(data);
const { allOptions } = useOptions(options, defaultOptions);
const { computedLineData } = useLineNullValues(internalData);
const { areaPathDefinition } = useSparklineArea(computedLineData);

const computedColor = computed(() => internalData.value[0].color);

const areaColor = computed(
  () => data.value[0].areaColor || computedColor.value
);

function getSparklineOptions(options: Options) {
  return {
    ...options,
    noMinSize: true,
  };
}

function xScaleGenerator(
  data: Data,
  _labels: Array<string>,
  size: ContainerSize
) {
  return scaleLinear()
    .range([0, size.width])
    .domain([0, data[0].values.length - 1]);
}
</script>

<style lang="scss" scoped>
@use './styles';
</style>
