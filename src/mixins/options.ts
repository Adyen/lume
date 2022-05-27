import { computed, PropType } from '@vue/composition-api';

interface Options {
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
