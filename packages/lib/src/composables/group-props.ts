import { PropType } from 'vue';

import { orientationValidator } from '@/composables/props';
import { Scale } from '@/composables/scales';

import { Orientation, ORIENTATIONS } from '@/utils/constants';
import type { DatasetValueObject, InternalData } from '@/types/dataset';
import type { ContainerSize } from '@/types/size';
import type { Options } from '@/types/options';

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
    options: {
      type: Object as PropType<T>,
      default: () => ({}),
    },
    orientation: {
      type: String as PropType<Orientation>,
      default: ORIENTATIONS.VERTICAL,
      validator: orientationValidator,
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
    containerSize: {
      type: Object as PropType<ContainerSize>,
      default: () => ({ width: 0, height: 0 }),
    },
    transition: {
      type: Boolean,
      default: true,
    },
    classList: {
      type: [String, Array] as PropType<string | Array<string>>,
      default: () => [],
    },
  });
