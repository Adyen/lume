import { ComputedRef, Ref, computed } from '@vue/composition-api';
import { scaleBand, ScaleBand } from 'd3-scale';

import { Scale } from '@/mixins/scales';

import { Orientation, ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';

// VERY MUCH WORK IN PROGRESS
// TODO: Support horizontal & cleanup
export function useGroupedBarMixin(
  data: ComputedRef<Data<DatasetValueObject<number>>>,
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation: Ref<Orientation>,
  hoveredIndex: Ref<number>
) {
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
    if (orientation.value === ORIENTATIONS.HORIZONTAL) {
      return value >= 0 ? xScale.value(0) : xScale.value(value);
    }
    const domain = xScale.value.domain();
    return (
      (xScale.value as ScaleBand<number | string>)(domain[index]) +
      xSubgroup.value(barIndex)
    );
  }

  function getBarTranslateY(value: number, index: number, barIndex: number) {
    if (orientation.value === ORIENTATIONS.HORIZONTAL) {
      const domain = yScale.value.domain();
      return (
        (yScale.value as ScaleBand<number | string>)(domain[index]) +
        ySubgroup.value(barIndex)
      );
    }
    return value < 0 ? yScale.value(0) : yScale.value(value);
  }

  function getBarWidth(value: number) {
    if (orientation.value === ORIENTATIONS.HORIZONTAL) {
      return value < 0
        ? xScale.value(0) - xScale.value(value)
        : xScale.value(value) - xScale.value(0);
    }
    return xSubgroup.value.bandwidth();
  }

  function getBarHeight(value: number) {
    if (orientation.value === ORIENTATIONS.HORIZONTAL) {
      return ySubgroup.value.bandwidth();
    }
    return value < 0
      ? yScale.value(value) - yScale.value(0)
      : yScale.value(0) - yScale.value(value);
  }

  function barAttributeGenerator(
    barValue: number,
    index: number,
    groupIndex: number
  ) {
    const color = data.value[index].color;
    const x = getBarTranslateX(barValue, groupIndex, index);
    const y = getBarTranslateY(barValue, groupIndex, index);
    const width = getBarWidth(barValue);
    const height = getBarHeight(barValue);

    return {
      fillClass: `adv-fill-color-${color}`,
      x,
      y,
      width,
      height,
      isFaded: hoveredIndex.value !== -1 && hoveredIndex.value !== groupIndex,
    };
  }

  return { barAttributeGenerator };
}
