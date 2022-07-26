import { PropType, ref, Ref, watchEffect } from '@vue/composition-api';
import { ScaleBand, scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';

import { flatValues, isBandScale } from '@/utils/helpers';

import { DEFAULT_PADDING, Orientation, ORIENTATIONS } from '@/constants';
import { ContainerSize } from '@/types/size';
import { Data, DatasetValueObject } from '@/types/dataset';

export type Scale = ScaleBand<string | number> | ScaleLinear<number, number>;

export type ScaleGenerator<T extends Scale = Scale> = (
  data: Data,
  labels: Array<string>,
  size: ContainerSize
) => T;

export const withScales = () => ({
  xScale: {
    type: Function as PropType<ScaleGenerator | ScaleBand<string | number>>,
    default: null,
  },
  yScale: {
    type: Function as PropType<
      ScaleGenerator<ScaleLinear<number, number>> | ScaleLinear<number, number>
    >,
    default: null,
  },
});

/**
 * Generates a reactive pair of scales with base settings.
 *
 * @param data The chart data.
 * @param labels The chart labels.
 * @param size The chart container size.
 * @returns A x-axis scale (band) and a y-axis scale (linear).
 */
export function useBaseScales(
  data: Ref<Data<DatasetValueObject>>,
  labels: Ref<Array<string | number>>,
  size: ContainerSize,
  orientation?: Ref<Orientation>
) {
  const xScale = ref<Scale>();
  const yScale = ref<Scale>();

  function generateScales() {
    const { width, height } = size;

    if (orientation.value === ORIENTATIONS.HORIZONTAL) {
      // horizontal
      // x = scaleLinear : data : width
      // y = scaleBand : labels : height

      xScale.value = generateLinearScale(data.value, width, orientation.value);
      yScale.value = generateBandScale(labels.value, height);
    } else {
      // vertical
      // x = scaleBand : labels : width
      // y = scaleLinear : data : height

      xScale.value = generateBandScale(labels.value, width);
      yScale.value = generateLinearScale(data.value, height, orientation.value);
    }

    console.log('orientation:', orientation.value);
  }

  watchEffect(generateScales);

  return { xScale, yScale };
}

function generateBandScale(domain: Array<string | number>, size: number) {
  const range = [0, size];

  return scaleBand<string | number>().range(range).domain(domain);
}

function generateLinearScale(
  data: Data<DatasetValueObject>,
  size: number,
  orientation: Orientation
): ScaleLinear<number, number, never> {
  const allValues = flatValues(data).filter((v) => v != null);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const range = [0, size];
  const domain =
    orientation === ORIENTATIONS.HORIZONTAL
      ? [minValue, maxValue]
      : [maxValue, minValue];

  return scaleLinear<number, number>().range(range).domain(domain);
}

/**
 * Checks if a provided argument is an instance of Scale.
 *
 * @param arg The variable to test.
 * @returns `true` if it is a Scale, `false` otherwise.
 */
export function isScale(arg: unknown): arg is Scale {
  return (
    (arg as Scale).range !== undefined || (arg as Scale).copy !== undefined
  );
}

/**
 * Returns the `x` position of the provided index in the scale.
 *
 * @param scale A linear or band scale.
 * @param index The index to get the x position of.
 * @returns The x position
 */
export function getXByIndex(scale: Scale, index: number): number {
  return isBandScale(scale)
    ? scale.bandwidth() / 2 + scale(scale.domain()[index])
    : scale(index);
}

export function getPaddedScale(scale: ScaleBand<string | number>) {
  return scale
    .copy()
    .paddingInner(DEFAULT_PADDING)
    .paddingOuter(DEFAULT_PADDING / 2);
}
