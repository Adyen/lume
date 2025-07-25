import { computed, ComputedRef, PropType, reactive, Ref } from 'vue';

import { BAR_HEIGHT, ORIENTATIONS } from '@/utils/constants';

import { computeColor } from '@/utils/colors';
import { getEmptyArrayFromData, isDatasetValueObject } from '@/utils/helpers';

import { Colors, type DivergentColors, type Orientation } from '@/types/utils';
import type {
  ColorPalette,
  Data,
  Dataset,
  DatasetValue,
  DatasetValueObject,
  InternalData,
  InternalDataset,
} from '@/types/dataset';
import type { ContainerSize } from '@/types/size';
import type { Options } from '@/types/options';

import { warn, Warnings } from '@/utils/warnings';

function computeValues(values: Array<DatasetValue<number>>) {
  return values.map((value) => {
    // If value is not a DatasetValueObject, convert it into one
    return isDatasetValueObject(value)
      ? value
      : ({ value } as DatasetValueObject);
  });
}

function isInternalDataset(
  dataset: unknown
): dataset is InternalDataset<DatasetValueObject> {
  return (dataset as InternalDataset<DatasetValueObject>).__internal === true;
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
  title: {
    type: String,
    default: null,
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

  const chartID = crypto.randomUUID();

  const internalData: ComputedRef<InternalData> = computed(() => {
    if (data.value.length > 5) warn(Warnings.DatasetLength);

    return data.value?.map(
      (
        dataset: Dataset<DatasetValue> | InternalDataset<DatasetValueObject>,
        index: number
      ) => {
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
        ? computedLabels.value.length *
            (((options?.value.barHeight as number) || BAR_HEIGHT) * 2) +
            ((options?.value.barHeight as number) || BAR_HEIGHT) || size.height
        : size.height;

    containerSize.width = size.width;
    containerSize.height = height;
  }

  return {
    chartID,
    computedLabels,
    containerSize,
    internalData,
    updateSize,
  };
}
