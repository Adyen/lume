import { computed, PropType } from '@vue/composition-api';

interface AxisOptions {
  gridLines?: boolean;
  label?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickFormat?: string | (() => string);
  tickPadding?: number;
  withLabel?: boolean;
  skip?: number;
}

export interface Options {
  xAxisOptions?: AxisOptions;
  yAxisOptions?: AxisOptions;
  [key: string]: unknown;
}

export const withOptions = () => ({
  options: {
    type: Object as PropType<Options>,
    default: () => ({})
  },
});

export const withAxisOptions = () => ({
  options: {
    type: Object as PropType<AxisOptions>,
    default: () => ({})
  }
})

export function useOptions(options: Options, defaultOptions: Options) {
  const allOptions = computed<Options>(() => ({
    ...defaultOptions,
    ...options,
    // Make sure we deep destructure the default/custom options
    yAxisOptions: {
      ...defaultOptions.yAxisOptions,
      ...options.yAxisOptions
    },
    xAxisOptions: {
      ...defaultOptions.xAxisOptions,
      ...options.xAxisOptions
    }
  }));

  return { allOptions };
}

export function useAxisOptions(options: AxisOptions, defaultOptions: AxisOptions) {
  const allOptions = computed<AxisOptions>(() => ({
    ...defaultOptions,
    ...options
  }));

  return { allOptions };
}
