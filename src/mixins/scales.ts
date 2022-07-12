import { PropType, ref, Ref, watchEffect } from '@vue/composition-api';
import { ScaleBand, scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';

import { flatValues, isBandScale } from '@/utils/helpers';

import { ContainerSize } from '@/types/size';
import { Data, DatasetValueObject } from '@/types/dataset';

export type Scale = ScaleBand<string | number> | ScaleLinear<number, number>;

export type ScaleGenerator<T extends Scale = Scale> = (
  data: Data,
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
  size: ContainerSize
) {
  const xScale = ref<ScaleBand<string | number>>();
  const yScale = ref<ScaleLinear<number, number, never>>();

  function generateScales() {
    xScale.value = generateXScale(labels.value, size);
    yScale.value = generateYScale(data.value, size);
  }

  watchEffect(generateScales);

  return { xScale, yScale };
}

function generateXScale(
  labels: Array<string | number>,
  size: ContainerSize
): ScaleBand<string | number> {
  const range = [0, size.width];
  const domain = labels?.map((v) => v);

  return scaleBand<string | number>().range(range).domain(domain);
}

function generateYScale(
  data: Data<DatasetValueObject>,
  size: ContainerSize
): ScaleLinear<number, number, never> {
  const allValues = flatValues(data).filter((v) => v != null);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const range = [0, size.height];
  const domain = [maxValue, minValue];

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
