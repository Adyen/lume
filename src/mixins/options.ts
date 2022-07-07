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
  skip?: true | number; // `true` will enable auto-skip, number will be used as amount of ticks to skip
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
  defaultOptions?: T
) {
  const allOptions = computed<T>(() =>
    defaultOptions
      ? (mergeDeep(defaultOptions, options.value) as T)
      : options.value
  );

  return { allOptions };
}
