<template>
  <adv-chart
    chart-type="line"
    :data="computedLineData"
    :options="allOptions"
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

      <adv-line-group
        v-bind="props"
        :with-points="false"
      />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { scaleLinear } from 'd3-scale';

import AdvChart from '@/core/adv-chart';
import AdvLineGroup from '@/core/adv-line-group';

import { useBase, withBase } from '@/mixins/base';
import { useOptions, withOptions } from '@/mixins/options';
import { useLineNullValues } from '@/mixins/line-null-values';
import { useSparklineArea } from './mixins/sparkline-area';
import { Color } from '@/types/colors';

import { Data } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

import { options as defaultOptions } from './defaults';

const defaultColor: Color = '01';

export default defineComponent({
  components: { AdvChart, AdvLineGroup },
  props: {
    ...withBase(null),
    ...withOptions(),
  },
  setup(props) {
    const { data, options } = toRefs(props);

    const { computedData } = useBase(data);
    const { allOptions } = useOptions(options, defaultOptions);
    const { computedLineData } = useLineNullValues(computedData);
    const { areaPathDefinition } = useSparklineArea(computedLineData);

    const color = computed(() => data.value[0].color || defaultColor);

    const areaColor = computed(
      () => data.value[0].areaColor || data.value[0].color
    );

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
      computedLineData,
      xScaleGenerator,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
