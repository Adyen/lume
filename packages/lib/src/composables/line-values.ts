import { line, ScaleBand, ScaleLinear } from 'd3';

import { isBandScale } from '@/utils/helpers';
import { Scale } from './scales';

/**
 * Returns the X acessor function for a `ScaleBand`.
 *
 * @param scale The chart X axis scale.
 * @param lineIndex The index of the data point of the line to render.
 * @returns The X acessor function to provide to d3 `line` method.
 */
function getFindBandX(scale: ScaleBand<string | number>, lineIndex: number) {
  const xAxisOffset = scale.bandwidth() / 2;
  return (_: unknown, index: number) =>
    scale(scale.domain()[lineIndex + (index - 1)]) + xAxisOffset;
}

/**
 * Returns the X acessor function for a `ScaleLinear`.
 *
 * @param scale The chart X axis scale.
 * @param lineIndex The index of the data point of the line to render.
 * @returns The X acessor function to provide to d3 `line` method.
 */
function getFindLinearX(scale: ScaleLinear<number, number>, lineIndex: number) {
  return (_: unknown, index: number) => scale(lineIndex + (index - 1));
}

/**
 * Generates the path definition between the point at a provided index (`lineIndex`)
 * and the previous point relative to that index.
 *
 * @param lineIndex The index of the data point of the line to render.
 * @param values An array of the previous and current data value
 * @param xScale The chart X axis scale.
 * @param yScale The chart Y axis scale.
 * @returns A path definition string to provide to the `d` attribute of `<path>`.
 */
export function getLinePathDefinition(
  lineIndex: number,
  values: Array<number>,
  xScale: Scale,
  yScale: ScaleLinear<number, number>
) {
  const lineFn = line<number>()
    .x(
      isBandScale(xScale)
        ? getFindBandX(xScale, lineIndex)
        : getFindLinearX(xScale, lineIndex)
    )
    .y((d) => yScale(d));

  return lineFn(values);
}
