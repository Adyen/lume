import { computed, ComputedRef, Ref } from '@vue/composition-api';
import { scaleBand, ScaleBand, scaleLinear } from 'd3-scale';

import { getPaddedScale, Scale } from '@/mixins/scales';

import { Orientation, ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

export function useStackedAxes(
  groupedData: ComputedRef<DatasetValueObject[][]>,
  orientation: Ref<Orientation>
) {
  const isHorizontal = computed(
    () => orientation.value === ORIENTATIONS.HORIZONTAL
  );

  const stackedMinValue = computed(() => {
    const accumulatedValues = groupedData.value.map(
      (valueSet: DatasetValueObject[]) => {
        return valueSet
          .filter((value) => value.value < 0)
          .reduce((acc, curr) => acc + curr.value, 0);
      }
    );

    return Math.min(...accumulatedValues);
  });

  const stackedMaxValue = computed(() => {
    // Make sure we can handle both single values and arrays of values
    const accumulatedValues = groupedData.value.map(
      (valueSet: DatasetValueObject[]) => {
        return valueSet.reduce(
          (acc, curr) => (curr.value >= 0 ? acc + curr.value : acc),
          0
        );
      }
    );
    return Math.max(...accumulatedValues);
  });

  function stackedXScaleGenerator(
    _data: Data,
    labels: Array<string>,
    size: ContainerSize
  ) {
    return isHorizontal.value
      ? scaleLinear()
          .domain([stackedMinValue.value, stackedMaxValue.value])
          .range([0, size.width])
      : getPaddedScale(
          scaleBand()
            .domain(labels?.map((v) => v))
            .range([0, size.width])
        );
  }

  function stackedYScaleGenerator(
    _data: Data,
    labels: Array<string>,
    size: ContainerSize
  ) {
    return isHorizontal.value
      ? getPaddedScale(
          scaleBand()
            .domain(labels?.map((v) => v))
            .range([0, size.height])
        )
      : scaleLinear()
          .domain([stackedMaxValue.value, stackedMinValue.value])
          .range([0, size.height]);
  }

  return { stackedXScaleGenerator, stackedYScaleGenerator };
}

export function useStackedBarMixin(
  data: ComputedRef<Data<DatasetValueObject<number>>>,
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation: Ref<Orientation>,
  hoveredIndex: Ref<number>
) {
  const isHorizontal = computed(
    () => orientation.value === ORIENTATIONS.HORIZONTAL
  );

  const domain = computed(() =>
    isHorizontal.value ? yScale.value.domain() : xScale.value.domain()
  );

  const dataValues = computed(() =>
    data.value.map((d) => d.values.map((v) => v?.value))
  );

  function getBarTransform(value: number, index: number, offset: number) {
    let x: number, y: number;
    if (isHorizontal.value) {
      x = xScale.value(value >= 0 ? 0 + offset : value + offset);
      y = (yScale.value as ScaleBand<number | string>)(domain.value[index]);
    } else {
      x = (xScale.value as ScaleBand<number | string>)(domain.value[index]);
      y = yScale.value(value >= 0 ? value + offset : 0 + offset);
    }
    return { x, y };
  }

  function getPositiveBarWidth(value: number) {
    if (isHorizontal.value) {
      return xScale.value(value) - xScale.value(0);
    }
    return (xScale.value as ScaleBand<number | string>).bandwidth();
  }

  function getNegativeBarWidth(value: number) {
    if (isHorizontal.value) {
      return xScale.value(0) - xScale.value(value);
    }
    return (xScale.value as ScaleBand<number | string>).bandwidth();
  }

  function getPositiveBarHeight(value: number) {
    if (isHorizontal.value) {
      return (yScale.value as ScaleBand<number | string>).bandwidth();
    }
    return yScale.value(0) - yScale.value(value);
  }

  function getNegativeBarHeight(value: number) {
    if (isHorizontal.value) {
      return (yScale.value as ScaleBand<number | string>).bandwidth();
    }
    return yScale.value(value) - yScale.value(0);
  }

  function getPositiveOffset(index: number, groupIndex: number) {
    if (!index) return 0;

    return dataValues.value.reduce((acc, curr, i) => {
      if (i < index && curr[groupIndex] >= 0) acc += curr[groupIndex];
      return acc;
    }, 0);
  }

  function getNegativeOffset(index: number, groupIndex: number) {
    if (!index) return 0;

    return dataValues.value.reduce((acc, curr, i) => {
      if (i < index && curr[groupIndex] < 0) acc += curr[groupIndex];
      return acc;
    }, 0);
  }

  function barAttributeGenerator(
    barValue: DatasetValueObject,
    index: number,
    groupIndex: number
  ) {
    const { value, color: barColor } = barValue;
    const width =
      value >= 0 ? getPositiveBarWidth(value) : getNegativeBarWidth(value);
    const height =
      value >= 0 ? getPositiveBarHeight(value) : getNegativeBarHeight(value);
    const offset =
      value >= 0
        ? getPositiveOffset(index, groupIndex)
        : getNegativeOffset(index, groupIndex);
    const { x, y } = getBarTransform(value, groupIndex, offset);
    const color = barColor ?? data.value[index].color;

    return {
      fillClass: `adv-fill-color--${color}`,
      width,
      height,
      x,
      y,
      isFaded: hoveredIndex.value !== -1 && hoveredIndex.value !== groupIndex,
    };
  }

  return { barAttributeGenerator };
}
