import { Margins } from '@/constants';
import { mergeDeep } from '@/utils/helpers';
import { computed, PropType, Ref } from '@vue/composition-api';

interface Configs {
  margins?: Margins;
}

export interface AxisOptions extends Record<string, unknown> {
  gridLines?: boolean;
  withTitle?: boolean;
  title?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickFormat?: string | (() => string);
  tickPadding?: number;
  skip?: number;
}

export interface Options extends Configs, Record<string, unknown> {
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
