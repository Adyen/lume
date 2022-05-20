import { computed } from '@vue/composition-api';
import { Data } from '@/types/dataset';

export function useNegativeValues(
  data: Data,
  height: number,
  yScale: any,
  isHorizontal: boolean
) {
  const hasNegativeValues = computed(() =>
    data
      .map((dataset) => dataset.values)
      .flat()
      .some((v) => v < 0)
  );

  const negativeHeight = computed(() => height - yScale(0));

  const negativeTransform = computed(() =>
    isHorizontal ? `translate(0, 0)` : `translate(0, ${yScale(0)})`
  );

  return { hasNegativeValues, negativeHeight, negativeTransform };
}
