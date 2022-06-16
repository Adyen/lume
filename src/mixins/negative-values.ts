import { computed, Ref, ComputedRef } from '@vue/composition-api';
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
  xScale?: Ref<Function>,
  yScale?: Ref<Function>,
  isHorizontal?: ComputedRef<boolean>
) {
  const negativeHeight = computed(
    () =>
        containerSize.height - (isHorizontal?.value ? 0 : yScale.value?.(0) || 0)
  );

  const negativeWidth = computed(
      () => (isHorizontal?.value ? xScale.value?.(0) || 0 : containerSize.width)
  );

  const negativeTransform = computed(() =>
    isHorizontal.value ? `translate(0, 0)` : `translate(0, ${yScale.value?.(0) || 0})`
  );

  return { negativeHeight, negativeWidth, negativeTransform };
}
