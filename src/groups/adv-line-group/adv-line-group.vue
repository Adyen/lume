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

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import AdvLine from '@/core/adv-line';
import AdvPoint from '@/core/adv-point';

import { getXByIndex } from '@/composables/scales';
import { useLineNullValues } from '@/composables/line-null-values';
import { withGroupProps } from '@/groups/composables/group-props';

import { getHighestValue } from '@/utils/helpers';
import { DatasetValueObject } from '@/types/dataset';

const props = defineProps({
  ...withGroupProps(),
  withPoints: {
    type: Boolean,
    default: true,
  },
  transition: {
    type: Boolean,
    default: true,
  },
});

const { data, xScale, yScale } = toRefs(props);

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
</script>

<style lang="scss" scoped>
@use './styles';
</style>
