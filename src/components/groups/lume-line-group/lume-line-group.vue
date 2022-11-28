<template>
  <g
    class="lume-line-group"
    data-j-lume-line-group
  >
    <!-- Overlay dashed line -->
    <path
      v-bind="overlayLineAttributes"
      class="lume-line-group__overlay-line"
      data-j-lume-line-group__overlay-line
    />

    <!-- Line groups -->
    <g
      v-for="dataset in computedGroupData"
      :key="dataset.label"
      class="lume-line-group__group"
    >
      <g class="lume-line-group__lines">
        <lume-line
          v-for="(_, index) in dataset.values"
          :key="`line-${index}`"
          :path-definition="getPathDefinition(index, dataset.values)"
          :color="dataset.color"
          :dashed="dataset.isDashed(index)"
          :transition="transition"
          :width="options.lineWidth"
          :x-scale="xScale"
        />
      </g>
      <g
        v-if="withPoints"
        class="lume-line-group__points"
        data-j-lume-line-group__points
      >
        <lume-point
          v-for="(_, index) in dataset.values"
          :key="`point-${index}`"
          :active="isPointActive(index)"
          :color="dataset.color"
          :index="index"
          :radius="pointRadius"
          :value="getPointValue(index, dataset.values)"
          :x-scale="xScale"
          :y-scale="yScale"
        />
      </g>
    </g>
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import LumeLine from '@/components/core/lume-line';
import LumePoint from '@/components/core/lume-point';

import { getXByIndex } from '@/composables/scales';
import { useLineNullValues } from '@/composables/line-null-values';
import { useLineValues } from '@/composables/line-values';
import { withGroupProps } from '@/components/groups/composables/group-props';
import { LineChartOptions } from '@/composables/options';

import { getHighestValue } from '@/utils/helpers';
import { DatasetValueObject } from '@/types/dataset';

export default defineComponent({
  components: { LumeLine, LumePoint },
  props: {
    ...withGroupProps<LineChartOptions>(),
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
    const { data, options, xScale, yScale } = toRefs(props);

    const computedGroupData = computed(() => {
      // Check if all datasets have `isDashed` function (which means data has been computed for line null values)
      if (data.value.every((dataset) => dataset.isDashed)) {
        return data.value;
      }

      // Compute line null values and return it
      const { computedLineData } = useLineNullValues(data);
      return computedLineData.value;
    });

    const overlayLineAttributes = computed(() => {
      if (props.hoveredIndex === -1) return;

      const highestValue = getHighestValue(data.value, props.hoveredIndex);

      const x = getXByIndex(xScale.value, props.hoveredIndex);

      return {
        d: `M ${x},${yScale.value.range()[1]}
            V ${yScale.value(highestValue)}`, // Move to X index, Vertical line to the highest point
      };
    });

    const pointRadius = computed(
      () => options.value?.lineWidth * 2 || undefined // If no `lineWidth`, returns NaN which needs to be undefined
    );

    function getPathDefinition(
      index: number,
      computedLineValues: Array<DatasetValueObject<number>>
    ) {
      const values =
        index === 0
          ? []
          : [
            computedLineValues[index - 1]?.value,
            computedLineValues[index]?.value,
          ];

      const { pathDefinition } = useLineValues(
        index,
        values,
        xScale.value,
        yScale.value
      );

      return pathDefinition.value || '';
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
      getPathDefinition,
      getPointValue,
      isPointActive,
      overlayLineAttributes,
      pointRadius,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
