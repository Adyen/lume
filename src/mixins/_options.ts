import { computed, PropType } from '@vue/composition-api';

interface Options {
  [key: string]: any;
}

export const withOptions = () => ({
  options: {
    type: Object as PropType<Options>,
    default: () => ({}),
  },
});

export function useOptions(options: Options, defaultOptions: Options) {
  console.log('options:', options);

  const allOptions = computed<Options>(() => ({
    ...defaultOptions,
    ...options,
  }));

  return { allOptions };
}
