import Vue, { computed, ComputedRef, PropType, reactive, Ref } from 'vue';

import {
  BAR_HEIGHT,
  Colors,
  DivergentColors,
  Orientation,
  ORIENTATIONS,
} from '@/utils/constants';

import { computeColor } from '@/utils/colors';
import {
  getEmptyArrayFromData,
  isDatasetValueObject,
  nanoid,
} from '@/utils/helpers';

import {
  ColorPalette,
  Data,
  Dataset,
  DatasetValue,
  DatasetValueObject,
  InternalData,
  InternalDataset,
} from '@/types/dataset';
import { ContainerSize } from '@/types/size';

import { Options } from './options';
import { warn, Warnings } from '@/utils/warnings';

function computeValues(values: Array<DatasetValue<number>>) {
  return values.map((value) => {
    // If value is not a DatasetValueObject, convert it into one
    return isDatasetValueObject(value)
      ? value
      : ({ value } as DatasetValueObject);
  });
}

function isInternalDataset(dataset: unknown): dataset is InternalDataset {
  return (dataset as InternalDataset).__internal === true;
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
  color: {
    type: String as PropType<Colors | DivergentColors>,
    default: Colors.Skyblue,
  },
});

export function useBase(
  data?: Ref<Data | InternalData>,
  labels?: Ref<Array<string>>,
  color?: Ref<Colors | DivergentColors>,
  options?: Ref<Options>,
  orientation?: Ref<Orientation>
) {
  const containerSize = reactive({
    width: 0,
    height: 0,
  });

  const chartID = nanoid(12);

  const internalData: ComputedRef<InternalData> = computed(() => {
    if (data.value.length > 5) warn(Warnings.DatasetLength);

    return data.value?.map(
      (dataset: Dataset<DatasetValue> | InternalDataset, index: number) => {
        // Prevent re-computing internal datasets
        if (isInternalDataset(dataset)) return dataset;

        const _values = computeValues(dataset.values);
        const _color = computeColor(
          dataset.color,
          color?.value,
          options?.value.colorPalette as ColorPalette,
          index
        );

        return {
          ...dataset,
          values: _values,
          color: _color,
          __internal: true as const,
        };
      }
    );
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
    chartID,
    computedLabels,
    containerSize,
    internalData,
    updateSize,
  };
}
