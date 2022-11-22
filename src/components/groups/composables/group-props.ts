import { PropType } from 'vue';

import { Options } from '@/composables/options';
import { Scale } from '@/composables/scales';

import { InternalData } from '@/types/dataset';

export const withGroupProps = <T extends Options = Options>() => ({
  data: {
    type: Array as PropType<InternalData>,
    required: true,
  },
  labels: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },
  xScale: {
    type: Function as PropType<Scale>,
    required: true,
  },
  yScale: {
    type: Function as PropType<Scale>,
    required: true,
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
