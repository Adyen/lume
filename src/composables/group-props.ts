import { PropType } from 'vue';

import { Options } from '@/composables/options';
import { orientationValidator } from '@/composables/props';
import { Scale } from '@/composables/scales';

import { Orientation, ORIENTATIONS } from '@/utils/constants';
import { DatasetValueObject, InternalData } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

export const withGroupProps = <
  T extends Options = Options,
  K extends DatasetValueObject = DatasetValueObject
>(
    useLabels = true,
    useContainerSize = true
  ) => ({
  /* Required */
    data: {
      type: Array as PropType<InternalData<K>>,
      required: true,
    },
    /* With defaults */
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
    transition: {
      type: Boolean,
      default: true,
    },
    classList: {
      type: [String, Array] as PropType<string | Array<string>>,
      default: () => [],
    },
    /* Optional */
    ...(useLabels
      ? {
        labels: {
          type: Array as PropType<Array<string | number>>,
          default: () => [],
        },
      }
      : {}),
    ...(useContainerSize
      ? {
        containerSize: {
          type: Object as PropType<ContainerSize>,
          default: () => ({ width: 0, height: 0 }),
        },
      }
      : {}),
  });
