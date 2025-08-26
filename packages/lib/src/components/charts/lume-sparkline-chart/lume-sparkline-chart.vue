<template>
  <lume-chart
    v-bind="props"
    chart-type="line"
    :options="getSparklineOptions(allOptions)"
    :x-scale="xScaleGenerator"
    v-on="componentEventPropagator"
  >
    <template #groups="groupProps">
      <path
        v-if="allOptions.showArea"
        :class="[
          'sparkline-chart__area',
          options.withTransition !== false
            ? 'sparkline-chart__area--transition'
            : '',
          `lume-fill--${areaColor || computedColor}`,
          'lume-fill--faded',
        ]"
        :d="areaPathDefinition(groupProps.xScale, groupProps.yScale)"
        data-j-sparkline__area
      />

      <lume-line-group
        v-bind="groupProps"
        :with-points="false"
        v-on="componentEventPropagator"
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

<script setup lang="ts">
import { computed, toRefs, useSlots } from 'vue';
import { scaleLinear } from 'd3';

import LumeChart from '@/components/core/lume-chart';
import LumeLineGroup from '@/components/groups/lume-line-group';

import { useBase, withBase } from '@/composables/base';
import { useEvents } from '@/composables/events';
import { useOptions, withOptions } from '@/composables/options';
import { useLineNullValues } from '@/composables/line-null-values';
import { useSparklineArea } from './composables/sparkline-area';

import type { Data } from '@/types/dataset';
import type { ChartEmits } from '@/types/events';
import type { ContainerSize } from '@/types/size';
import type { LineChartOptions, Options } from '@/types/options';

import { options as defaultOptions } from './defaults';
import { excludeGroups } from '@/utils/helpers';

const props = defineProps({
  ...withBase(null),
  ...withOptions<LineChartOptions>(),
});

// https://github.com/vuejs/core/issues/4294#issuecomment-1480392140
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Emits extends ChartEmits {}
const emit = defineEmits<Emits>();

const { componentEventPropagator } = useEvents(emit);

const slots = excludeGroups(useSlots());

const { data, options } = toRefs(props);

const { internalData } = useBase(data);
const { allOptions } = useOptions(options, defaultOptions);
const { computedLineData } = useLineNullValues(internalData);
const { areaPathDefinition } = useSparklineArea(computedLineData);

const computedColor = computed(() => internalData.value?.[0]?.color);

const areaColor = computed(
  () => data.value?.[0]?.areaColor || computedColor.value
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
  if (!data.length) return;
  return scaleLinear()
    .range([0, size.width])
    .domain([0, data[0].values.length - 1]);
}

defineExpose({
  areaPathDefinition,
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
