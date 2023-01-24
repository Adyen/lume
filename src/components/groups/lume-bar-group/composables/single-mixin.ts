import { computed, ComputedRef, Ref } from 'vue';
import { ScaleBand } from 'd3';

import { Scale } from '@/composables/scales';

import { DEFAULT_COLOR } from '@/utils/colors';
import { Orientation, ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';

export function useSingleBarMixin(
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

  function getBarTransform(value: number, index: number) {
    let x: number, y: number;
    if (isHorizontal.value) {
      x = value >= 0 ? xScale.value(0) : xScale.value(value);
      y = yScale.value(yScale.value.domain()[index] as number);
    } else {
      x = xScale.value(xScale.value.domain()[index] as number);
      y = value < 0 ? yScale.value(0) : yScale.value(value);
    }
    return { x, y };
  }

  function getBarWidth(value: number) {
    if (isHorizontal.value) {
      return value < 0
        ? xScale.value(0) - xScale.value(value)
        : xScale.value(value) - xScale.value(0);
    }

    return (xScale.value as ScaleBand<number | string>).bandwidth();
  }

  function getBarHeight(value: number) {
    if (isHorizontal.value) {
      return (yScale.value as ScaleBand<number | string>).bandwidth();
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
    const color = barColor ?? data.value[index].color ?? DEFAULT_COLOR;
    const { x, y } = getBarTransform(value, groupIndex);
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
