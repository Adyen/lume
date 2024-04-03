import { computed, ComputedRef, PropType, Ref } from 'vue';
import { ScaleLinear } from 'd3';

import { Scale } from '@/composables/scales';

import {
  BAR_TYPES,
  BarType,
  Orientation,
  ORIENTATIONS,
} from '@/utils/constants';
import { error, Errors } from '@/utils/errors';
import { fillArrayWithNullValues } from '@/utils/helpers';
import type { DatasetValueObject, InternalData } from '@/types/dataset';

function typeValidator(type: string): boolean {
  return Object.values(BAR_TYPES).includes(type as BarType) || type == null;
}

export function orientationValidator(orientation: string): boolean {
  return Object.values(ORIENTATIONS).includes(orientation as Orientation);
}

export const withBarProps = (useOrientation = false) => ({
  type: {
    type: String,
    default: null,
    validator: typeValidator,
  },
  ...(useOrientation
    ? {
      orientation: {
        type: String as PropType<Orientation>,
        default: ORIENTATIONS.VERTICAL,
        validator: orientationValidator,
      },
    }
    : {}),
});

export function useBarMixin(
  data: Ref<InternalData>,
  labels: Ref<Array<string | number>>
) {
  /** Array of padded (null = 0) number values */
  const multiBarData: ComputedRef<InternalData> = computed(() => {
    return data.value.map((dataset) => ({
      ...dataset,
      values: fillArrayWithNullValues(
        dataset.values,
        labels?.value?.length ?? 0
      ).map((datasetValue) => ({
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
  const groupedData: ComputedRef<DatasetValueObject[][]> = computed(() => {
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

export function getBarChartType(data: Ref<InternalData>, type: Ref<string>) {
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
    if (!scale) {
      error(Errors.BarScaleNull);
    }

    if (Math.min(...scale.domain()) > 0) {
      error(Errors.BarScaleDomainAbove0);
    }
  }

  const barXScale = computed(() => {
    const scale = isHorizontal.value
      ? (() => {
        checkValidDomain(xScale.value as ScaleLinear<number, number>);

        return xScale.value;
      })()
      : xScale.value;

    return scale;
  });

  const barYScale = computed(() => {
    const scale = isHorizontal.value
      ? yScale.value
      : (() => {
        checkValidDomain(yScale.value as ScaleLinear<number, number>);

        return yScale.value;
      })();

    return scale;
  });

  return { barXScale, barYScale };
}
