import { computed, ComputedRef, Ref } from 'vue';
import { scaleBand, ScaleBand } from 'd3';

import { Scale } from '@/composables/scales';

import { Colors, Orientation, ORIENTATIONS } from '@/utils/constants';
import type { Data, DatasetValueObject } from '@/types/dataset';

const NULL_BAR = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export function useGroupedBarMixin(
  data: ComputedRef<Data<DatasetValueObject<number>>>,
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation: Ref<Orientation>,
  hoveredIndex: Ref<number>,
  classList: Array<string>
) {
  const isHorizontal = computed(
    () => orientation.value === ORIENTATIONS.HORIZONTAL
  );

  const xSubgroup = computed(() => {
    return scaleBand<number>()
      .domain(data.value.map((_, index) => index))
      .range([0, (xScale.value as ScaleBand<number | string>).bandwidth()])
      .padding(0);
  });

  const ySubgroup = computed(() => {
    return scaleBand<number>()
      .domain(data.value.map((_, index) => index))
      .range([0, (yScale.value as ScaleBand<number | string>).bandwidth()])
      .padding(0);
  });

  function getBarTranslateX(value: number, index: number, barIndex: number) {
    if (isHorizontal.value) {
      return value >= 0 ? xScale.value(0) : xScale.value(value);
    }
    const domain = xScale.value.domain();
    return (
      (xScale.value as ScaleBand<number | string>)(domain[index]) +
      xSubgroup.value(barIndex)
    );
  }

  function getBarTranslateY(value: number, index: number, barIndex: number) {
    if (isHorizontal.value) {
      const domain = yScale.value.domain();
      return (
        (yScale.value as ScaleBand<number | string>)(domain[index]) +
        ySubgroup.value(barIndex)
      );
    }
    return value < 0 ? yScale.value(0) : yScale.value(value);
  }

  function getBarWidth(value: number) {
    if (isHorizontal.value) {
      return value < 0
        ? xScale.value(0) - xScale.value(value)
        : xScale.value(value) - xScale.value(0);
    }
    return xSubgroup.value.bandwidth();
  }

  function getBarHeight(value: number) {
    if (isHorizontal.value) {
      return ySubgroup.value.bandwidth();
    }
    return value < 0
      ? yScale.value(value) - yScale.value(0)
      : yScale.value(0) - yScale.value(value);
  }

  function barAttributeGenerator(
    barValue: DatasetValueObject,
    index: number,
    groupIndex: number
  ) {
    const validScales = xScale.value && yScale.value;
    if (!validScales) return NULL_BAR;

    const { value, color: barColor } = barValue;
    const color =
      barColor ?? data.value[index].color ?? Object.values(Colors)[index];
    const x = getBarTranslateX(value, groupIndex, index);
    const y = getBarTranslateY(value, groupIndex, index);
    const width = getBarWidth(value);
    const height = getBarHeight(value);

    return {
      classList: [`lume-fill--${color}`, ...classList],
      x,
      y,
      width,
      height,
      isFaded: hoveredIndex.value !== -1 && hoveredIndex.value !== groupIndex,
      isNegative: value < 0,
    };
  }

  return { barAttributeGenerator };
}
