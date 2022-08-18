import {
  computed,
  ComputedRef,
  PropType,
  reactive,
  Ref,
  set,
} from '@vue/composition-api';
import { BAR_HEIGHT, Orientation, ORIENTATIONS } from '@/constants';
import { getEmptyArrayFromData } from '@/utils/helpers';
import { Data, DatasetValueObject } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

export type DataValidator = (value: Data) => boolean;

export const withBase = (dataValidator: DataValidator = null, isLabelsRequired = true) => ({
  data: {
    type: Array as PropType<Data>,
    required: true,
    validator: dataValidator || undefined,
  },
  labels: {
    type: Array as PropType<Array<string>>,
    required: isLabelsRequired,
    default: isLabelsRequired ? undefined : (): Array<string> | null => null,
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

  const computedData: ComputedRef<Data<DatasetValueObject>> = computed(() => {
    return data.value?.map((dataset) => {
      return {
        ...dataset,
        values: dataset.values.map((value) => {
          // If value is not a DatasetValueObject, convert it into one
          return typeof value === 'number' || Array.isArray(value)
            ? ({ value } as DatasetValueObject)
            : value;
        }),
      };
    });
  });

  const isHorizontal = computed(
    () => orientation?.value === ORIENTATIONS.HORIZONTAL
  );

  function updateSize(size: ContainerSize) {
    const height = isHorizontal.value
      ? getEmptyArrayFromData(data).length * (BAR_HEIGHT * 2)
      : size.height;

    set(containerSize, 'width', size.width);
    set(containerSize, 'height', height);
  }

  return {
    computedData,
    containerSize,
    isHorizontal,
    updateSize,
  };
}
