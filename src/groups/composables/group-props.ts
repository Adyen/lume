import { PropType } from 'vue';

import { Scale } from '@/composables/scales';

import { Data, DatasetValueObject } from '@/types/dataset';

export const withGroupProps = () => ({
  data: {
    type: Array as PropType<Data<DatasetValueObject>>,
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
});
