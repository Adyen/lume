import { ComputedRef, Ref, computed } from '@vue/composition-api';
import { scaleBand, ScaleLinear, ScaleBand } from 'd3-scale';

import { Data, DatasetValueObject } from '@/types/dataset';

// VERY MUCH WORK IN PROGRESS
// TODO: Support horizontal & cleanup
export function useGroupedBarMixin(
  data: ComputedRef<Data<DatasetValueObject<number>>>,
  xScale: Ref<ScaleBand<string>>,
  yScale: Ref<ScaleLinear<number, number>>,
  hoveredIndex: Ref<number>
) {
  const xSubgroup = computed(() => {
    return scaleBand<number>()
      .domain(data.value.map((_, index) => index))
      .range([0, xScale.value.bandwidth()])
      .padding(0);
  });

  function getBarTranslateX(value: number, index: number, barIndex: number) {
    const domain = xScale.value.domain();
    return xScale.value(domain[index]) + xSubgroup.value(barIndex);
  }

  function getBarTranslateY(value: number, index: number, barIndex: number) {
    return value < 0 ? yScale.value(0) : yScale.value(value);
  }

  function getBarWidth(value: number) {
    return xSubgroup.value.bandwidth();
  }

  function getBarHeight(value: number) {
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
