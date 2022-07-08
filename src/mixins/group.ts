import { Margins } from '@/constants';
import { mergeDeep } from '@/utils/helpers';
import { computed, PropType, Ref } from '@vue/composition-api';

export const withGroup = () => ({
  onMouseoverFn: {
    type: Function as PropType<(index: number) => void>,
    default: true,
  },
});

// export function useOptions<T extends Options = Options>(
//   options: Ref<T>,
//   defaultOptions?: T
// ) {
//   const allOptions = computed<T>(() =>
//     defaultOptions
//       ? (mergeDeep(defaultOptions, options.value) as T)
//       : options.value
//   );

//   return { allOptions };
// }
