<template>
  <adv-chart
    :data="computedLineData"
    :labels="computedLabels"
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
      />

      <adv-line-group
        v-bind="props"
        :with-points="false"
      />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from '@vue/composition-api';
import { scaleLinear } from 'd3-scale';

import AdvChart from '@/core/adv-chart';
import AdvLineGroup from '@/core/adv-line-group';

import { useBase, withBase } from '@/mixins/base';
import { useOptions, withOptions } from '@/mixins/options';
import { useLineNullValues } from '@/mixins/line-null-values';
import { useSparklineArea } from './mixins/sparkline-area';

import { Data } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

import { options as defaultOptions } from './defaults';

export default defineComponent({
  components: { AdvChart, AdvLineGroup },
  props: {
    ...withBase(),
    ...withOptions(),
  },
  setup(props) {
    const { data, options } = toRefs(props);

    const { computedData } = useBase(data);
    const { allOptions } = useOptions(options, defaultOptions);
    const { computedLineData } = useLineNullValues(computedData);
    const { areaPathDefinition } = useSparklineArea(computedLineData);

    const computedLabels = computed(() => {
      return data.value[0].values.map((_, i) => i);
    });

    const color = computed(() => data.value[0].color);

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
      computedLabels,
      computedLineData,
      xScaleGenerator,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

$line-stroke-width: 2px;
$line-stroke-hover-width: 4px;
$ghost-line-stroke-width: 8px;

.sparkline-chart {
  &__area {
    fill: $adv-color-grey-20;
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
      &--color-#{$color} {
        fill: nth($map, 3);
        opacity: 0.5;
      }
    }
  }

  &__line {
    stroke-width: $line-stroke-width;
    stroke-linejoin: round;
    stroke-linecap: round;
    fill: none;
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
      &--color-#{$color} {
        stroke: nth($map, 1);
      }
    }

    &--dashed {
      stroke-dasharray: 2%;
    }
  }
}
</style>
