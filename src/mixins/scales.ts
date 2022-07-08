import { ref, Ref, watchEffect } from '@vue/composition-api';
import { ScaleBand, scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';

import { flatValues } from '@/utils/helpers';

import { ContainerSize } from '@/types/size';
import { Data, DatasetValueObject } from '@/types/dataset';

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

function generateXScale(labels: Array<string | number>, size: ContainerSize) {
  const range = [0, size.width];
  const domain = labels?.map((v) => v);

  return scaleBand<string | number>().rangeRound(range).domain(domain);
}

function generateYScale(data: Data<DatasetValueObject>, size: ContainerSize) {
  const allValues = flatValues(data).filter((v) => v != null);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const range = [0, size.height];
  const domain = [maxValue, minValue];

  return scaleLinear<number, number>().rangeRound(range).domain(domain);
}
