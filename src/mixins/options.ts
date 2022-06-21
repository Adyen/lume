import { computed, PropType } from '@vue/composition-api';

interface AxisOptions {
  gridLines?: boolean;
  label?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickFormat?: string | (() => string);
  tickPadding?: number;
  withLabel?: boolean;
}
export interface Options {
  xAxisOptions?: AxisOptions;
  yAxisOptions?: AxisOptions;
  [key: string]: unknown;
}

export const withOptions = () => ({
  options: {
    type: Object as PropType<Options>,
    default: () => ({}),
  },
});

export function useOptions(options: Options, defaultOptions: Options) {
  const allOptions = computed<Options>(() => ({
    ...defaultOptions,
    ...options,
  }));

  return { allOptions };
}
