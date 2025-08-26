import { format as d3Format } from 'd3';

import { warn, Warnings } from '@/utils/warnings';

type FormatFunctionArgs = [number | string, ...Array<number | string>];

type FormatFunction = (...args: FormatFunctionArgs) => number | string;

export type Format = string | FormatFunction;

export const useFormat = (format: Format) => {
  let formatter: FormatFunction = null;

  switch (typeof format) {
  case 'string':
    try {
      formatter = d3Format(format) as FormatFunction;
    } catch {
      warn(Warnings.InvalidFormat);
      formatter = null;
    }
    break;
  case 'function':
    formatter = format;
    break;
  default:
    formatter = null;
  }

  function formatValue(...args: FormatFunctionArgs) {
    return formatter ? formatter(...args) : args[0];
  }

  return formatValue;
};
