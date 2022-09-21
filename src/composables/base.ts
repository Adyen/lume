import Vue, { computed, ComputedRef, PropType, reactive, Ref } from 'vue';

import {
  BAR_HEIGHT,
  COLORS,
  Orientation,
  ORIENTATIONS,
} from '@/constants';

import { getEmptyArrayFromData, isDatasetValueObject } from '@/utils/helpers';
import {
  Data,
  DatasetValue,
  DatasetValueObject,
  InternalData,
} from '@/types/dataset';
import { Color } from '@/types/colors';
import { ContainerSize } from '@/types/size';

function computeValues(values: Array<DatasetValue<number>>) {
  return values.map((value) => {
    // If value is not a DatasetValueObject, convert it into one
    return isDatasetValueObject(value)
      ? value
      : ({ value } as DatasetValueObject);
  });
}

export type DataValidator = (value: Data) => boolean;

export const withBase = (dataValidator: DataValidator = null) => ({
  data: {
    type: Array as PropType<Data>,
    required: true,
    validator: dataValidator || undefined,
  },
  labels: {
    type: Array as PropType<Array<string>>,
    default: undefined,
  },
});

export function useBase(
  data: Ref<Data>,
  labels?: Ref<Array<string>>,
  orientation?: Ref<Orientation>
) {
  const containerSize = reactive({
    width: 0,
    height: 0,
  });

  const internalData: ComputedRef<InternalData> = computed(() => {
    return data.value?.map((dataset, index) => {
      const values = computeValues(dataset.values);
      const color = dataset.color || Object.values(COLORS)[index];
      const label = dataset.label;

      return { values, color, label, __isInternal: true };
    });
  });

  const computedLabels = computed(() => {
    if (Array.isArray(labels.value)) return labels.value;
    return getEmptyArrayFromData(data.value).map((_, i) => i);
  });

  function updateSize(size: ContainerSize) {
    const height =
      orientation?.value === ORIENTATIONS.HORIZONTAL
        ? getEmptyArrayFromData(data).length * (BAR_HEIGHT * 2)
        : size.height;

    Vue.set(containerSize, 'width', size.width);
    Vue.set(containerSize, 'height', height);
  }

  return {
    computedLabels,
    containerSize,
    internalData,
    updateSize,
  };
}
