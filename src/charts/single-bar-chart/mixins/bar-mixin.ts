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

export function useBarMixin(
  data: Data<DatasetValueObject>,
  containerSize: { width: number; height: number },
  padding: number,
  labels: Array<string>
) {
  const xScale = ref(null);
  const yScale = ref(null);

  /** Array of padded (null = 0) number values */
  const singleBarData = computed(() => {
    const dataset = data[0]; // For single bar chart, `data` has only 1 dataset
    return dataset.values.map((datasetValue) => datasetValue?.value || 0);
  });

  const multiBarData = computed(() => {
    return data.map((dataset) => ({
      ...dataset,
      values: dataset.values.map((datasetValue) => datasetValue?.value || 0),
    }));
  });

  const singleMaxValue = computed(() => {
    return Math.max(...singleBarData.value);
  });

  const singleMinValue = computed(() => {
    return Math.min(...singleBarData.value);
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
      .domain([singleMaxValue.value, singleMinValue.value])
      .nice(10)
      .rangeRound([0, containerSize.height]);
  };

  watch(containerSize, getXScale);
  watch(containerSize, getYScale);

  return {
    singleBarData,
    singleMinValue,
    singleMaxValue,
    multiBarData,
    xScale,
    yScale,
  };
}
