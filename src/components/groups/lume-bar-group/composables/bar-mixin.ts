import { computed, ComputedRef, PropType, Ref } from 'vue';
import { ScaleBand, ScaleLinear } from 'd3';

import { getPaddedScale, Scale } from '@/composables/scales';

import { BAR_TYPES, BarType, Orientation, ORIENTATIONS } from '@/constants';
import { DatasetValueObject, InternalData } from '@/types/dataset';
import { BarChartOptions } from '@/composables/options';

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

export function useBarMixin(data: Ref<InternalData>) {
  /** Array of padded (null = 0) number values */
  const multiBarData: ComputedRef<InternalData> = computed(() => {
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
  options?: Ref<BarChartOptions>,
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
    const { padding, paddingInner, paddingOuter } = options.value;
    const scale = isHorizontal.value
      ? (() => {
        checkValidDomain(xScale.value as ScaleLinear<number, number>);
        return xScale.value;
      })()
      : getPaddedScale(
          xScale.value as ScaleBand<string | number>,
          orientation.value,
          { padding, paddingInner, paddingOuter }
      );

    return scale;
  });

  const barYScale = computed(() => {
    const { padding, paddingInner, paddingOuter } = options.value;
    const scale = isHorizontal.value
      ? getPaddedScale(
          yScale.value as ScaleBand<string | number>,
          orientation.value,
          { padding, paddingInner, paddingOuter }
      )
      : (() => {
        checkValidDomain(yScale.value as ScaleLinear<number, number>);
        return yScale.value;
      })();

    return scale;
  });

  return { barXScale, barYScale };
}
