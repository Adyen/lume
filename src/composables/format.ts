import { format as d3Format } from 'd3';

import { warn, Warnings } from '@/utils/warnings';

type FormatFunction = (arg0: number | string) => number | string;
export type Format = string | FormatFunction;

export const useFormat = (format: Format) => {
  let formatter: FormatFunction = null;

  switch (typeof format) {
  case 'string':
    try {
      formatter = d3Format(format) as FormatFunction;
    } catch (error) {
      warn(Warnings.InvalidFormat);
      formatter = null;
    }
    break;
  case 'function':
    formatter = format;
    break;
  default:
    formatter = null;
    break;
  }

  function formatValue(value: number | string) {
    return formatter ? formatter(value) : value;
  }

  return formatValue;
};
