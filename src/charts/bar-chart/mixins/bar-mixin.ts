import {
  computed,
  ComputedRef,
  PropType,
  ref,
  watchEffect,
} from '@vue/composition-api';
import { scaleBand, scaleLinear } from 'd3-scale';

import { Data, DatasetValueObject } from '@/types/dataset';
import { ORIENTATIONS, Orientation, BarType, BAR_TYPES } from '@/constants';
import { Options } from '@/mixins/options';
import { flatValues } from '@/utils/helpers';

function typeValidator(type: string): boolean {
  return Object.values(BAR_TYPES).includes(type as BarType) || type == null;
}

function orientationValidator(orientation: string): boolean {
  return Object.values(ORIENTATIONS).includes(orientation as Orientation);
}

const DEFAULT_PADDING = 0.33;

export const withBarProps = () => ({
  type: {
    type: String,
    default: null,
    validator: typeValidator,
  },
  orientation: {
    type: String as PropType<Orientation>,
    default: ORIENTATIONS.VERTICAL,
    validator: orientationValidator,
  },
});

export function useBarMixin(
  type: BarType,
  data: Data<DatasetValueObject>,
  labels: Array<string>,
  containerSize: { width: number; height: number },
  isHorizontal: ComputedRef<boolean>,
  options?: Options
) {
  const xScale = ref(null);
  const yScale = ref(null);

  /** Array of padded (null = 0) number values */
  const singleBarData = computed(() => {
    const dataset = data[0]; // For single bar chart, `data` has only 1 dataset
    return dataset.values.map((datasetValue) => datasetValue?.value || 0);
  });

  /** Array of padded (null = 0) number values */
  const multiBarData: ComputedRef<Data<number>> = computed(() => {
    return data.map((dataset) => ({
      ...dataset,
      values: dataset.values.map((datasetValue) => datasetValue?.value || 0),
    }));
  });

  const allValues = flatValues(data).filter((v) => v != null);

  /**
   * Data points grouped by index. This is used for grouped/stacked bar charts.
   * Example: for datasets `{ values: [ 10, 20 ] }` and `{ values: [ 30, 40 ] }`,
   * `groupedData` will return `[[ 10, 30 ], [ 20, 40 ]]`.
   */
  const groupedData: ComputedRef<Array<number[]>> = computed(() => {
    return multiBarData.value?.reduce((accumulator, dataset) => {
      dataset.values.forEach((value, i) => {
        if (!accumulator[i]) accumulator[i] = [value];
        else accumulator[i].push(value);
      });
      return accumulator;
    }, []);
  });

  const singleMinValue = computed(() => {
    return Math.min(...singleBarData.value);
  });

  const singleMaxValue = computed(() => {
    return Math.max(...singleBarData.value);
  });

  const groupedMinValue = computed(() => {
    return Math.min(...allValues);
  });

  const groupedMaxValue = computed(() => {
    return Math.max(...allValues);
  });

  const stackedMinValue = computed(() => {
    const accumulatedValues = groupedData.value.map((valueSet: number[]) => {
      return valueSet
        .filter((value) => value < 0)
        .reduce((acc, curr) => acc + curr, 0);
    });

    return Math.min(...accumulatedValues);
  });

  const stackedMaxValue = computed(() => {
    // Make sure we can handle both single values and arrays of values
    const accumulatedValues = groupedData.value.map((valueSet: number[]) => {
      return valueSet.reduce((acc, curr) => acc + curr, 0);
    });
    return Math.max(...accumulatedValues);
  });

  const minValue = computed(() => {
    switch (type) {
      default:
      case BAR_TYPES.SINGLE:
        return singleMinValue.value;
      case BAR_TYPES.GROUPED:
        return groupedMinValue.value;
      case BAR_TYPES.STACKED:
        return stackedMinValue.value;
    }
  });

  const maxValue = computed(() => {
    switch (type) {
      default:
      case BAR_TYPES.SINGLE:
        return singleMaxValue.value;
      case BAR_TYPES.GROUPED:
        return groupedMaxValue.value;
      case BAR_TYPES.STACKED:
        return stackedMaxValue.value;
    }
  });

  const padding = computed(
    () => (options?.padding as number) ?? DEFAULT_PADDING
  );

  const setXScaleValue = () => {
    xScale.value = isHorizontal.value
      ? scaleLinear()
          .domain([minValue.value, maxValue.value])
          .nice()
          .rangeRound([0, containerSize.width])
      : scaleBand()
          .paddingInner(padding.value)
          .paddingOuter(padding.value / 2)
          .domain(labels?.map((v) => v))
          .rangeRound([0, containerSize.width]);
  };

  const setYScaleValue = () => {
    yScale.value = isHorizontal.value
      ? scaleBand()
          .paddingInner(padding.value)
          .paddingOuter(padding.value / 2)
          .domain(labels?.map((v) => v))
          .rangeRound([0, containerSize.height])
      : scaleLinear()
          .domain([maxValue.value, minValue.value])
          .nice(10)
          .rangeRound([0, containerSize.height]);
  };

  watchEffect(() => {
    setXScaleValue();
    setYScaleValue();
  });

  return {
    minValue,
    maxValue,
    xScale,
    yScale,
    singleBarData,
    multiBarData,
    groupedData,
  };
}
