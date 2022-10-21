import { PropType } from 'vue';

import { Options } from '@/composables/options';
import { Scale } from '@/composables/scales';

import { InternalData } from '@/types/dataset';

export const withGroupProps = () => ({
  data: {
    type: Array as PropType<InternalData>,
    required: true,
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
    type: Object as PropType<Options>,
    default: () => ({}),
  },
});
