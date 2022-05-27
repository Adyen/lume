import { computed, Ref } from '@vue/composition-api';
import { Data, DatasetValueObject } from '@/types/dataset';
import { flatValues } from '@/utils/helpers';
import { ContainerSize } from '@/types/size';

export function checkNegativeValues(data: Data<DatasetValueObject>) {
  const hasNegativeValues = computed(() => flatValues(data).some((v) => v < 0));
  return { hasNegativeValues };
}

export function useNegativeValues(
  containerSize?: ContainerSize,
  // eslint-disable-next-line @typescript-eslint/ban-types
  yScale?: Ref<Function>,
  isHorizontal?: boolean
) {
  const negativeHeight = computed(
    () => containerSize.height - yScale.value?.(0) || 0
  );

  const negativeTransform = computed(() =>
    isHorizontal ? `translate(0, 0)` : `translate(0, ${yScale.value?.(0) || 0})`
  );

  return { negativeHeight, negativeTransform };
}
