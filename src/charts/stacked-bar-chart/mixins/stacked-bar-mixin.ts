import { computed, ref, watch } from '@vue/composition-api';
import { scaleBand, scaleLinear } from 'd3-scale';

import { Data, DatasetValueObject } from '@/types/dataset';

const defaultPadding = 0.33;

export const withBarProps = (padding?: number) => ({
  barsConfig: {
    type: Object,
    default: () => ({}),
  },
  padding: {
    type: Number,
    default: padding || defaultPadding,
  },
});

export function useStackedBarMixin(
  data: Data<DatasetValueObject>,
  containerSize: { width: number; height: number },
  padding: number,
  labels: Array<string>
) {
  const xScale = ref(null);
  const yScale = ref(null);

  const multiBarData = computed(() => {
    return data.map((dataset) => ({
      ...dataset,
      values: dataset.values.map((datasetValue) => datasetValue?.value || 0),
    }));
  });

  const stackedData = computed(() => {
    const result = [];
    multiBarData.value.forEach((dataset) => {
      dataset.values.forEach((value, i) => {
        if (!result[i]) result[i] = [value];
        else result[i].push(value);
      });
    });
    return result;
  });

  const maxValue = computed(() => {
    // Make sure we can handle both single values and arrays of values
    const accumulatedValues = stackedData.value.map((valueSet: number[]) => {
      return valueSet.reduce((acc, curr) => acc + curr, 0);
    });
    return Math.max(...accumulatedValues);
  });

  const minValue = computed(() => {
    const accumulatedValues = stackedData.value.map((valueSet: number[]) => {
      return valueSet
        .filter((value) => value < 0)
        .reduce((acc, curr) => acc + curr, 0);
    });

    return Math.min(...accumulatedValues);
  });

  const getXScale = () => {
    xScale.value = scaleBand()
      .paddingInner(padding)
      .paddingOuter(padding / 2)
      .domain(labels.map((_, index) => index))
      .rangeRound([0, containerSize.width]);
  };

  const getYScale = () => {
    yScale.value = scaleLinear()
      .domain([maxValue.value, minValue.value])
      .nice(10)
      .rangeRound([0, containerSize.height]);
  };

  watch(containerSize, getXScale);
  watch(containerSize, getYScale);

  return {
    minValue,
    maxValue,
    multiBarData,
    xScale,
    yScale,
  };
}
