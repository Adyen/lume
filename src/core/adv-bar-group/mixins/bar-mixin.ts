import { computed, ComputedRef, Ref } from '@vue/composition-api';
import { ScaleBand } from 'd3-scale';

import { getPaddedScale, Scale } from '@/mixins/scales';

import { Orientation, ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';

export function useBarMixin(data: Ref<Data<DatasetValueObject>>) {
  /** Array of padded (null = 0) number values */
  const multiBarData: ComputedRef<Data<number>> = computed(() => {
    return data.value.map((dataset) => ({
      ...dataset,
      values: dataset.values.map((datasetValue) => datasetValue?.value || 0),
    }));
  });

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

  return { multiBarData, groupedData };
}

export function getBarChartType(
  data: ComputedRef<Data<DatasetValueObject<number>>>,
  type: Ref<string>
) {
  return data.value.length === 1 ? 'single' : type.value;
}

export function useBarScales(
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation?: Ref<Orientation>
) {
  const barXScale = computed(() => {
    const scale =
      orientation.value === ORIENTATIONS.HORIZONTAL
        ? xScale.value
        : getPaddedScale(xScale.value as ScaleBand<string | number>);

    return scale;
  });

  const barYScale = computed(() => {
    const scale =
      orientation.value === ORIENTATIONS.HORIZONTAL
        ? getPaddedScale(yScale.value as ScaleBand<string | number>)
        : yScale.value;

    return scale;
  });

  return { barXScale, barYScale };
}
