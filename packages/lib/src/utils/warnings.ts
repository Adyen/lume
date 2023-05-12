import { isProd } from './helpers';

export enum Warnings {
  // Datasets
  DatasetLength = 'Our guidelines highly recommend not having more than 5 datasets in one chart.\nLearn more: https://lume.design/guidelines/datasets',
  ColorLoop = 'Colors will loop around after the 5th dataset. You can prevent this by setting specific colors for your datasets.',
  Empty = 'The dataset(s) provided are empty.',

  // Format
  InvalidFormat = 'The string provided to format is invalid. Please refer to https://github.com/d3/d3-format for valid arguments.',

  // SVG rules
  NotContainedInSvg = 'This component is an `SVGElement`, thus it is required to be inside an `<svg>` container.',
}

const PREFIX = '[lume] ';

export function warn(warning: Warnings, devOnly = true) {
  if (devOnly && isProd()) return;
  console.warn(PREFIX + 'Warning: ' + warning);
}
