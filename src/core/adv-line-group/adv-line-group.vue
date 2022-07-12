<template>
  <g class="adv-line-group">
    <!-- Overlay dashed line -->
    <path
      v-bind="overlayLineAttributes"
      class="adv-line-group__overlay-line"
    />

    <!-- Line groups -->
    <g
      v-for="dataset in computedLineData"
      :key="dataset.label"
      class="adv-line-group__group"
    >
      <g class="adv-line-group__lines">
        <chart-line
          v-for="(_, index) in dataset.values"
          :key="`line-${index}`"
          :x-scale="xScale"
          :y-scale="yScale"
          :values="getLineValues(index, dataset.values)"
          :index="index"
          :color="dataset.color"
          :dashed="dataset.isDashed(index)"
        />
      </g>
      <g
        v-if="withPoints"
        class="adv-line-group__points"
      >
        <line-point
          v-for="(_, index) in dataset.values"
          :key="`point-${index}`"
          :x-scale="xScale"
          :y-scale="yScale"
          :value="getPointValue(index, dataset.values)"
          :index="index"
          :color="dataset.color"
          :active="isPointActive(index)"
        />
      </g>
    </g>

    <!-- Overlay bars -->
    <g class="adv-line-group__overlay">
      <bar
        v-for="(_, index) in computedLineData[0].values"
        v-bind="getOverlayBarAttributes(index)"
        :key="`overlay-${index}`"
        fill-class="adv-fill-color-transparent"
        @mouseover.native="handleMouseover(index)"
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
import { ScaleLinear } from 'd3-scale';

import Bar from '@/core/bar';
import ChartLine from '@/charts/line-chart/components/chart-line.vue';
import LinePoint from '@/charts/line-chart/components/line-point.vue';

import { useBase } from '@/mixins/base';
import { withGroup } from '@/mixins/group';
import { useLineNullValues } from '@/mixins/line-null-values';
import { getXByIndex, Scale } from '@/mixins/scales';

import { getScaleStep, isBandScale } from '@/utils/helpers';

import { Data, DatasetValueObject } from '@/types/dataset';

export default defineComponent({
  components: { ChartLine, LinePoint, Bar },
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
      type: Function as PropType<ScaleLinear<number, number>>,
      required: true,
    },
    hoveredIndex: {
      type: Number,
      default: -1,
    },
    withPoints: {
      type: Boolean,
      default: true,
    },
    ...withGroup(),
  },

  setup(props) {
    const { data, xScale, yScale } = toRefs(props);

    const { computedData } = useBase(data);

    const { computedLineData } = useLineNullValues(computedData);

    function getOverlayBarAttributes(index: number) {
      const step = getScaleStep(xScale.value);
      const translateX = isBandScale(xScale.value)
        ? xScale.value(xScale.value.domain()[index])
        : xScale.value(index) - step / 2;

      return {
        width: step,
        height: yScale.value(Math.min(...yScale.value.domain())),
        transform: `translate(${translateX}, 0)`,
      };
    }

    const overlayLineAttributes = computed(() => {
      if (props.hoveredIndex === -1) return;

      const highestValue = Math.max(
        ...computedLineData.value.map(
          (dataset) => dataset.values[props.hoveredIndex].value
        )
      );

      const x = getXByIndex(xScale.value, props.hoveredIndex);

      return {
        d: `M ${x},${yScale.value.range()[1]}
            V ${yScale.value(highestValue)}`, // Move to X index, Vertical line to the highest point
      };
    });

    function getLineValues(
      index: number,
      computedLineValues: Array<DatasetValueObject<number>>
    ) {
      // First value
      if (index === 0) return [];

      return [
        computedLineValues[index - 1]?.value,
        computedLineValues[index]?.value,
      ];
    }

    function getPointValue(
      index: number,
      computedLineValues: Array<DatasetValueObject<number>>
    ) {
      return computedLineValues[index]?.value;
    }

    function isPointActive(index: number) {
      return props.hoveredIndex === index;
    }

    function handleMouseover(index: number) {
      props?.onMouseoverFn(index);
    }

    return {
      computedLineData,
      getLineValues,
      getOverlayBarAttributes,
      getPointValue,
      handleMouseover,
      isPointActive,
      overlayLineAttributes,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/_variables.scss' as *;

.adv-line-group {
  &__overlay-line {
    stroke: $adv-color-grey-30;
    stroke-width: 1px;
    stroke-dasharray: 2 2;

    transition: all $chart-transition-time ease-out;
  }
}
</style>
