import {
  computed,
  PropType,
  reactive,
  ComputedRef,
  set,
  Ref,
} from '@vue/composition-api';
import { ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';
import { ContainerSize } from '@/types/size';

type DataValidator = (value: Data) => boolean;

export const withBase = (dataValidator?: DataValidator) => ({
  data: {
    type: Array as PropType<Data>,
    required: true,
    validator: dataValidator,
  },
  labels: {
    type: Array as PropType<Array<string>>,
    default: (): Array<string> | null => null,
  },
});

export function useBase(
  data: Ref<Data>,
  labels: Ref<Array<string>>,
  orientation = ORIENTATIONS.VERTICAL
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

  function updateSize(size: ContainerSize) {
    set(containerSize, 'width', size.width);
    set(containerSize, 'height', size.height);
  }

  const domain = computed(
    () => labels.value?.map((_, i) => i) || data.value?.map((_, i: number) => i)
  );

  const isHorizontal = computed(() => orientation === ORIENTATIONS.HORIZONTAL);

  return {
    computedData,
    containerSize,
    updateSize,
    domain,
    isHorizontal,
  };
}
