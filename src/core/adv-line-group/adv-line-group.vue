<template>
  <g
    class="adv-line-group"
    data-j-adv-line-group
  >
    <!-- Overlay dashed line -->
    <path
      v-bind="overlayLineAttributes"
      class="adv-line-group__overlay-line"
      data-j-adv-line-group__overlay-line
    />

    <!-- Line groups -->
    <g
      v-for="dataset in computedGroupData"
      :key="dataset.label"
      class="adv-line-group__group"
    >
      <g class="adv-line-group__lines">
        <adv-line
          v-for="(_, index) in dataset.values"
          :key="`line-${index}`"
          :x-scale="xScale"
          :y-scale="yScale"
          :values="getLineValues(index, dataset.values)"
          :index="index"
          :color="dataset.color"
          :dashed="dataset.isDashed(index)"
          :transition="transition"
        />
      </g>
      <g
        v-if="withPoints"
        class="adv-line-group__points"
        data-j-adv-line-group__points
      >
        <adv-point
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

import AdvLine from '@/core/adv-line';
import AdvPoint from '@/core/adv-point';

import { getXByIndex, Scale } from '@/mixins/scales';
import { useBase } from '@/mixins/base';
import { useLineNullValues } from '@/mixins/line-null-values';

import { getHighestValue } from '@/utils/helpers';
import { Data, DatasetValueObject } from '@/types/dataset';

export default defineComponent({
  components: { AdvLine, AdvPoint },
  props: {
    data: {
      type: Array as PropType<Data<DatasetValueObject>>,
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
    transition: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const { data, xScale, yScale } = toRefs(props);

    const { computedData } = useBase(data);

    const computedGroupData = computed(() => {
      // Check if all datasets have `isDashed` function (which means data has been computed for line null values)
      if (computedData.value.every((dataset) => dataset.isDashed)) {
        return computedData.value;
      }

      // Compute line null values and return it
      const { computedLineData } = useLineNullValues(computedData);
      return computedLineData.value;
    });

    const overlayLineAttributes = computed(() => {
      if (props.hoveredIndex === -1) return;

      const highestValue = getHighestValue(
        computedData.value,
        props.hoveredIndex
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

    return {
      computedGroupData,
      getLineValues,
      getPointValue,
      isPointActive,
      overlayLineAttributes,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
