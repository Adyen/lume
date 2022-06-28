import { mergeDeep } from '@/utils/helpers';
import { computed, PropType, Ref } from '@vue/composition-api';

export interface AxisOptions extends Record<string, unknown> {
  gridLines?: boolean;
  label?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickFormat?: string | (() => string);
  tickPadding?: number;
  withLabel?: boolean;
  skip?: number;
}

export interface Options extends Record<string, unknown> {
  xAxisOptions?: AxisOptions;
  yAxisOptions?: AxisOptions;
}

export const withOptions = <T = Options>() => ({
  options: {
    type: Object as PropType<T>,
    default: () => ({}),
  },
});

export function useOptions<T extends Options = Options>(
  options: Ref<T>,
  defaultOptions: T
) {
  const allOptions = computed<T>(() =>
    options.value
      ? (mergeDeep(defaultOptions, options.value) as T)
      : defaultOptions
  );

  return { allOptions };
}
