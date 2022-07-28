import { Margins } from '@/constants';
import { mergeDeep } from '@/utils/helpers';
import { computed, PropType, Ref } from '@vue/composition-api';

export interface AxisOptions extends Options {
  gridLines?: boolean;
  withTitle?: boolean;
  title?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickFormat?: string | (() => string);
  tickPadding?: number;
  skip?: true | number; // `true` will enable auto-skip, number will be used as amount of ticks to skip
}

export interface TooltipOptions extends Options {
  offset?: number;
}

export interface ChartOptions extends Options {
  margins?: Margins;
  xAxisOptions?: AxisOptions;
  yAxisOptions?: AxisOptions;
  tooltipOptions?: TooltipOptions;
  startOnZero?: boolean;
}

export type Options = Record<string, unknown>;

export const withOptions = <T = Options>() => ({
  options: {
    type: Object as PropType<T>,
    default: () => ({}),
  },
});

export function useOptions<T extends Options = Options>(
  options: Ref<T>,
  defaultOptions?: T
) {
  const allOptions = computed<T>(() =>
    defaultOptions
      ? (mergeDeep(defaultOptions, options.value) as T)
      : options.value
  );

  return { allOptions };
}
