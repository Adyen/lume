import { computed, ComputedRef, PropType, Ref } from '@vue/composition-api';
import { ScaleBand, ScaleLinear } from 'd3-scale';

import { getPaddedScale, Scale } from '@/mixins/scales';

import { BarType, BAR_TYPES, Orientation, ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';

function typeValidator(type: string): boolean {
  return Object.values(BAR_TYPES).includes(type as BarType) || type == null;
}

export function orientationValidator(orientation: string): boolean {
  return Object.values(ORIENTATIONS).includes(orientation as Orientation);
}

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

export function useBarMixin(data: Ref<Data<DatasetValueObject>>) {
  /** Array of padded (null = 0) number values */
  const multiBarData: ComputedRef<Data<DatasetValueObject>> = computed(() => {
    return data.value.map((dataset) => ({
      ...dataset,
      values: dataset.values.map((datasetValue) => ({
        ...datasetValue,
        value: datasetValue?.value || 0,
      })),
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
  const isHorizontal = computed(
    () => orientation.value === ORIENTATIONS.HORIZONTAL
  );

  function checkValidDomain(scale: ScaleLinear<number, number>) {
    if (Math.min(...scale.domain()) > 0) {
      console.error(`Bar linear scale domain cannot start above 0!`);
    }
  }

  const barXScale = computed(() => {
    const scale = isHorizontal.value
      ? (() => {
          checkValidDomain(xScale.value as ScaleLinear<number, number>);
          return xScale.value;
        })()
      : getPaddedScale(xScale.value as ScaleBand<string | number>);

    return scale;
  });

  const barYScale = computed(() => {
    const scale = isHorizontal.value
      ? getPaddedScale(yScale.value as ScaleBand<string | number>)
      : (() => {
          checkValidDomain(yScale.value as ScaleLinear<number, number>);
          return yScale.value;
        })();

    return scale;
  });

  return { barXScale, barYScale };
}
