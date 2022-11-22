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
          `lume-fill--${areaColor || computedColor}`,
          'lume-fill--faded',
        ]"
        :d="areaPathDefinition(props.xScale, props.yScale)"
        data-j-sparkline__area
      />

      <lume-line-group
        v-bind="props"
        :with-points="false"
      />
    </template>
    <template
      v-for="(_, name) in slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData || {}"
      />
    </template>
  </lume-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { scaleLinear } from 'd3';

import LumeChart from '@/components/core/lume-chart';
import LumeLineGroup from '@/components/groups/lume-line-group';

import { useBase, withBase } from '@/composables/base';
import {
  LineChartOptions,
  Options,
  useOptions,
  withOptions,
} from '@/composables/options';
import { useLineNullValues } from '@/composables/line-null-values';
import { useSparklineArea } from './composables/sparkline-area';

import { Data } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

import { options as defaultOptions } from './defaults';
import { excludeGroups } from '@/utils/helpers';

export default defineComponent({
  components: { LumeChart, LumeLineGroup },
  props: {
    ...withBase(null),
    ...withOptions<LineChartOptions>(),
  },
  setup(props, context) {
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

    return {
      allOptions,
      areaColor,
      areaPathDefinition,
      computedColor,
      getSparklineOptions,
      xScaleGenerator,
      slots: excludeGroups(context.slots),
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
