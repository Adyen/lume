import { PropType, ref, Ref, watchEffect } from '@vue/composition-api';
import { ScaleBand, scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';

import { flatValues, isBandScale } from '@/utils/helpers';
import { ChartOptions } from '@/mixins/options';

import {
  Orientation,
  ORIENTATIONS,
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
} from '@/constants';
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
  orientation?: Ref<Orientation>,
  options?: Ref<ChartOptions>
) {
  const xScale = ref<Scale>(null);
  const yScale = ref<Scale>(null);

  function generateScales() {
    const { width, height } = size;
    if (!width && !height) return;

    if (orientation.value === ORIENTATIONS.HORIZONTAL) {
      // horizontal
      // x = scaleLinear : data : width
      // y = scaleBand : labels : height

      xScale.value = generateLinearScale(
        data.value,
        width,
        orientation.value,
        options.value.startOnZero
      );
      yScale.value = generateBandScale(labels.value, height);
    } else {
      // vertical
      // x = scaleBand : labels : width
      // y = scaleLinear : data : height

      xScale.value = generateBandScale(labels.value, width);
      yScale.value = generateLinearScale(
        data.value,
        height,
        orientation.value,
        options.value.startOnZero
      );
    }
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
  orientation: Orientation,
  startOnZero?: boolean
): ScaleLinear<number, number, never> {
  const allValues = flatValues(data).filter((v) => v != null);
  const minAvailableValue = Math.min(...allValues);
  const minValue = startOnZero && minAvailableValue > 0 ? 0 : minAvailableValue;
  const maxValue = Math.max(...allValues);

  const range = [0, size];
  const domain =
    orientation === ORIENTATIONS.HORIZONTAL
      ? [minValue, maxValue]
      : [maxValue, minValue];

  return scaleLinear<number, number>().range(range).domain(domain).nice();
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

export function getPaddedScale(
  scale: ScaleBand<string | number>,
  orientation?: Orientation
) {
  const padding =
    orientation === ORIENTATIONS.HORIZONTAL
      ? PADDING_HORIZONTAL
      : PADDING_VERTICAL;
  return scale
    .copy()
    .paddingInner(padding)
    .paddingOuter(padding / 2);
}
