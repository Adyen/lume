import { computed, ComputedRef, Ref } from '@vue/composition-api';
import { ScaleBand } from 'd3-scale';

import { Scale } from '@/mixins/scales';

import { Orientation, ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';

export function useSingleBarMixin(
  data: ComputedRef<Data<DatasetValueObject<number>>>,
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation: Ref<Orientation>,
  hoveredIndex: Ref<number>
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
    return isHorizontal.value
      ? value < 0
        ? xScale.value(0) - xScale.value(value)
        : xScale.value(value) - xScale.value(0)
      : (xScale.value as ScaleBand<number | string>).bandwidth();
  }

  function getBarHeight(value: number) {
    return isHorizontal.value
      ? (yScale.value as ScaleBand<number | string>).bandwidth()
      : value < 0
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
    const { x, y } = getBarTransform(value, groupIndex);
    const width = getBarWidth(value);
    const height = getBarHeight(value);

    return {
      fillClass: `adv-fill-color--${color}`,
      x,
      y,
      width,
      height,
      isFaded: hoveredIndex.value !== -1 && hoveredIndex.value !== groupIndex,
    };
  }

  return { barAttributeGenerator };
}
