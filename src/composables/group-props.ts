import { PropType } from 'vue';

import { Options } from '@/composables/options';
import { Scale } from '@/composables/scales';

import { DatasetValueObject, InternalData } from '@/types/dataset';

export const withGroupProps = <
  T extends Options = Options,
  K extends DatasetValueObject = DatasetValueObject
>() => ({
    data: {
      type: Array as PropType<InternalData<K>>,
      required: true,
    },
    labels: {
      type: Array as PropType<Array<string | number>>,
      default: () => [],
    },
    xScale: {
      type: Function as PropType<Scale>,
      default: () => null,
    },
    yScale: {
      type: Function as PropType<Scale>,
      default: () => null,
    },
    hoveredIndex: {
      type: Number,
      default: -1,
    },
    options: {
      type: Object as PropType<T>,
      default: () => ({}),
    },
  });
