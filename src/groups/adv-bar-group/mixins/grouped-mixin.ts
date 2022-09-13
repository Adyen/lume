import { computed, ComputedRef, Ref } from 'vue';
import { scaleBand, ScaleBand } from 'd3-scale';

import { Scale } from '@/mixins/scales';

import { Orientation, ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';

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
    const { value, color: barColor } = barValue;
    const color = barColor ?? data.value[index].color;
    const x = getBarTranslateX(value, groupIndex, index);
    const y = getBarTranslateY(value, groupIndex, index);
    const width = getBarWidth(value);
    const height = getBarHeight(value);

    return {
      classList: [`adv-fill-color--${color}`, ...classList],
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
