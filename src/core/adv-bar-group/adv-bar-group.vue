<template>
  <g class="adv-bar-group">
    <g
      v-for="(barGroup, groupIndex) in groupedData"
      :key="groupIndex"
    >
      <bar
        v-for="(barValue, index) in barGroup"
        v-bind="getBarAttributes(barValue, index, groupIndex, barGroup)"
        :key="`bar-${index}`"
        :animate="animate"
      />

      <bar
        v-bind="getOverlayConfig(groupIndex)"
        fill-class="adv-fill-color-transparent"
        :animate="false"
        @mouseover.native="handleMouseover(groupIndex)"
      />
    </g>
  </g>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  toRefs,
} from '@vue/composition-api';

import Bar from '../bar';

import { useBase } from '@/mixins/base';
import { withGroup } from '@/mixins/group';
import { Scale } from '@/mixins/scales';
import { getBarChartType, useBarMixin, useBarScales } from './mixins/bar-mixin';
import { useSingleBarMixin } from './mixins/single-mixin';
import { useGroupedBarMixin } from './mixins/grouped-mixin';
import { useStackedBarMixin } from './mixins/stacked-mixin';
import { useBarOverlay } from '@/charts/bar-chart/mixins/bar-overlay';
import { withBarProps } from '@/charts/bar-chart/mixins/bar-mixin';

import { Data } from '@/types/dataset';

export interface BarConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  fillClass: string;
  isFaded?: boolean;
}

const MIXIN_MAP = {
  single: useSingleBarMixin,
  grouped: useGroupedBarMixin,
  stacked: useStackedBarMixin,
};

export default defineComponent({
  components: { Bar },
  props: {
    data: {
      type: Array as PropType<Data>,
      required: true,
    },
    xScale: {
      type: Function as PropType<Scale>,
      required: true,
    },
    yScale: {
      type: Function as PropType<Scale>,
      required: true,
    },
    hoveredIndex: {
      type: Number,
      default: -1,
    },
    animate: {
      type: Boolean,
      default: true,
    },
    ...withBarProps(),
    ...withGroup(),
  },
  setup(props) {
    const { data, type, xScale, yScale, orientation, hoveredIndex } =
      toRefs(props);

    const { computedData } = useBase(data);

    const { groupedData } = useBarMixin(computedData);

    const { barXScale, barYScale } = useBarScales(xScale, yScale, orientation);

    const { getOverlayConfig } = useBarOverlay(
      barXScale,
      barYScale,
      orientation
    );

    const getBarAttributes = computed(() => {
      const chartType = getBarChartType(computedData, type);

      const { barAttributeGenerator } = MIXIN_MAP[chartType](
        computedData,
        barXScale,
        barYScale,
        orientation,
        hoveredIndex
      );
      return barAttributeGenerator;
    });

    function handleMouseover(index: number) {
      props?.onMouseoverFn(index);
    }

    return {
      barXScale,
      barYScale,
      getBarAttributes,
      getOverlayConfig,
      groupedData,
      handleMouseover,
    };
  },
});
</script>
