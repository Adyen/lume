import { computed, isRef, PropType, Ref } from 'vue';
import type { Options } from '@/types/options';
import { mergeDeep } from '@/utils/helpers';

export const withOptions = <T = Options>() => ({
  options: {
    type: Object as PropType<T>,
    default: () => ({}),
  },
});

export function useOptions<T extends Options = Options>(
  options: Ref<T>,
  defaultOptions?: T | Ref<T>
) {
  const allOptions = computed<T>(() => {
    const defaults = isRef(defaultOptions)
      ? defaultOptions?.value
      : defaultOptions;
    return defaults ? (mergeDeep(defaults, options.value) as T) : options.value;
  });

  return { allOptions };
}
