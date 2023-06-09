import { PropType, ref, Ref, watchEffect } from 'vue';
import { ScaleBand, scaleBand, ScaleLinear, scaleLinear } from 'd3';

import { flatValues, isBandScale } from '@/utils/helpers';
import { ChartOptions } from '@/composables/options';

import {
  Orientation,
  ORIENTATIONS,
  PADDING_HORIZONTAL,
  PADDING_VERTICAL,
} from '@/utils/constants';
import { ContainerSize } from '@/types/size';
import { InternalData } from '@/types/dataset';

export interface ComputedScaleBand extends ScaleBand<string | number> {
  labels: Array<string | number>;
}

export type Scale = ScaleBand<string | number> | ScaleLinear<number, number>;

export type ScaleGenerator<T extends Scale = Scale> = (
  data: InternalData,
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
  data: Ref<InternalData>,
  labels: Ref<Array<string | number>>,
  size: ContainerSize,
  orientation?: Ref<Orientation>,
  options?: Ref<ChartOptions>
) {
  const xScale = ref<Scale>(null);
  const yScale = ref<Scale>(null);

  function generateScales() {
    const { width, height } = size;
    const paddingOuter: number = (options.value.padding ||
      options.value.paddingOuter ||
      0) as number;

    if (!width && !height) return;
    if (!labels.value || !data.value) return;

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
      yScale.value = generateBandScale({
        domain: labels.value,
        size: height,
        paddingOuter,
      });
    } else {
      // vertical
      // x = scaleBand : labels : width
      // y = scaleLinear : data : height

      xScale.value = generateBandScale({
        domain: labels.value,
        size: width,
        paddingOuter,
      });
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

interface BandScaleGenerator {
  domain: Array<string | number>;
  size: number;
  paddingOuter: number;
}

function generateBandScale({
  domain,
  size,
  paddingOuter = 0,
}: BandScaleGenerator): ComputedScaleBand {
  const range = [0, size];
  return Object.assign(
    scaleBand<string | number>()
      .range(range)
      .paddingOuter(paddingOuter)
      .domain(domain.map((_, i) => i)),
    { labels: domain }
  ) as ComputedScaleBand;
}

function generateLinearScale(
  data: InternalData,
  size: number,
  orientation: Orientation,
  startOnZero?: boolean
): ScaleLinear<number, number, never> {
  const allValues = flatValues(data).filter((v) => v != null);
  const range = [0, size];
  // Prevent min and max values evaluating to -Infinity and Infinity when we don't have any values
  if (allValues.length === 0) {
    return scaleLinear<number, number>().range(range).domain([0, 0]).nice();
  }

  const minAvailableValue = Math.min(...allValues);
  const minValue = startOnZero && minAvailableValue > 0 ? 0 : minAvailableValue;
  const maxValue = Math.max(...allValues);
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
    (arg as Scale)?.range !== undefined || (arg as Scale)?.copy !== undefined
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
  orientation?: Orientation,
  {
    padding,
    paddingInner,
    paddingOuter,
  }: { padding?: number; paddingInner?: number; paddingOuter?: number } = {}
) {
  const defaultPadding =
    padding ??
    (orientation === ORIENTATIONS.HORIZONTAL
      ? PADDING_HORIZONTAL
      : PADDING_VERTICAL);

  return scale
    .copy()
    .paddingInner(paddingInner ?? defaultPadding)
    .paddingOuter(paddingOuter ?? defaultPadding / 2);
}
