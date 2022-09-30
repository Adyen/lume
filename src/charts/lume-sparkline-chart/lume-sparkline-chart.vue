<template>
  <lume-chart
    v-bind="$props"
    chart-type="line"
    :options="getSparklineOptions(allOptions)"
    :x-scale="xScaleGenerator"
  >
    <template #groups="props">
      <path
        v-if="allOptions.showArea"
        :class="[
          'sparkline-chart__area',
          `sparkline-chart__area--color-${areaColor || color}`,
        ]"
        :d="areaPathDefinition(props.xScale, props.yScale)"
        data-j-sparkline__area
      />

      <lume-line-group
        v-bind="props"
        :with-points="false"
      />
    </template>
  </lume-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { scaleLinear } from 'd3-scale';

import LumeChart from '@/core/lume-chart';
import LumeLineGroup from '@/groups/lume-line-group';

import { useBase, withBase } from '@/composables/base';
import { Options, useOptions, withOptions } from '@/composables/options';
import { useLineNullValues } from '@/composables/line-null-values';
import { useSparklineArea } from './composables/sparkline-area';
import { Color } from '@/types/colors';

import { Data } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

import { options as defaultOptions } from './defaults';

const defaultColor: Color = '01';

export default defineComponent({
  components: { LumeChart, LumeLineGroup },
  props: {
    ...withBase(null),
    ...withOptions(),
  },
  setup(props) {
    const { data, options } = toRefs(props);

    const { internalData } = useBase(data);
    const { allOptions } = useOptions(options, defaultOptions);
    const { computedLineData } = useLineNullValues(internalData);
    const { areaPathDefinition } = useSparklineArea(computedLineData);

    const color = computed(() => data.value[0].color || defaultColor);

    const areaColor = computed(
      () => data.value[0].areaColor || data.value[0].color
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

    return {
      allOptions,
      areaColor,
      areaPathDefinition,
      color,
      getSparklineOptions,
      xScaleGenerator,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
