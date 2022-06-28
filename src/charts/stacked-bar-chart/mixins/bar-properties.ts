import { computed, ComputedRef } from '@vue/composition-api';
import { Data } from '@/types/dataset';

export function useBarProperties(
  data: ComputedRef<Data<number>>,
  isHorizontal: ComputedRef<boolean>,
  xScale,
  yScale
) {
  const domain = computed(() =>
    isHorizontal.value ? yScale.value.domain() : xScale.value.domain()
  );

  function getPositiveTransform(value: number, index: number, offset: number) {
    let x: number, y: number;
    if (isHorizontal.value) {
      x = xScale.value(0) + offset;
      y = yScale.value(domain.value[index]);
    } else {
      x = xScale.value(domain.value[index]);
      y = yScale.value(value) - offset;
    }
    return { x, y };
  }

  function getPositiveWidth(value: number) {
    if (isHorizontal.value) {
      return xScale.value(value) - xScale.value(0);
    }
    return xScale.value.bandwidth();
  }

  function getPositiveHeight(value: number) {
    if (isHorizontal.value) {
      return yScale.value.bandwidth();
    }
    return yScale.value(0) - yScale.value(value);
  }

  function getNegativeTransform(value: number, index: number, offset: number) {
    let x: number, y: number;
    if (isHorizontal.value) {
      x = xScale.value(value) - offset;
      y = yScale.value(domain.value[index]);
    } else {
      x = xScale.value(domain.value[index]);
      y = yScale.value(0) + offset;
    }
    return { x, y };
  }

  function getNegativeWidth(value: number) {
    if (isHorizontal.value) {
      return xScale.value(0) - xScale.value(value);
    }
    return xScale.value.bandwidth();
  }

  function getNegativeHeight(value: number) {
    if (isHorizontal.value) {
      return yScale.value.bandwidth();
    }
    return yScale.value(value) - yScale.value(0);
  }

  function mapNegativeBars(
    bars: Array<number>,
    barsIndex: number,
    hoveredIndex: number
  ) {
    return bars.reduce((acc, bar, index) => {
      if (bar == null) return acc;

      const offset = acc
        .map(({ width, height }) => (isHorizontal.value ? width : height))
        .reduce((sum, curr) => sum + curr, 0);
      const color = data.value[index].color;
      const { x, y } = getNegativeTransform(bar, barsIndex, offset);

      acc.push({
        x,
        y,
        width: getNegativeWidth(bar),
        height: getNegativeHeight(bar),
        fillClass: `adv-fill-color-${color}`,
        isFaded: hoveredIndex !== -1 && hoveredIndex !== barsIndex,
      });

      return acc;
    }, []);
  }

  function mapPositiveBars(
    bars: Array<number>,
    barsIndex: number,
    hoveredIndex: number
  ) {
    return bars.reduce((acc, bar, index) => {
      if (bar == null) return acc;

      const offset = acc
        .map(({ width, height }) => (isHorizontal.value ? width : height))
        .reduce((sum, curr) => sum + curr, 0);
      const color = data.value[index].color;
      const { x, y } = getPositiveTransform(bar, barsIndex, offset);

      acc.push({
        x,
        y,
        width: getPositiveWidth(bar),
        height: getPositiveHeight(bar),
        fillClass: `adv-fill-color-${color}`,
        isFaded: hoveredIndex !== -1 && hoveredIndex !== barsIndex,
      });

      return acc;
    }, []);
  }

  return { mapPositiveBars, mapNegativeBars };
}
