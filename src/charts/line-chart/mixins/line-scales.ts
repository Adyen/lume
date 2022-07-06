import { computed, nextTick, ref, Ref, watch } from '@vue/composition-api';
import { scaleBand, scaleLinear } from 'd3-scale';
import { Data, DatasetValueObject } from '@/types/dataset';
import { flatValues } from '@/utils/helpers';

export const withLineScales = (defaultStartOnZero = true) => ({
  startOnZero: {
    type: Boolean,
    default: defaultStartOnZero, // Guidelines state that baseline should be 0
  },
});

export function useLineScales(
  data: Ref<Data<DatasetValueObject>>,
  startOnZero: Ref<boolean>,
  hasNegativeValues: Ref<boolean>,
  containerSize: { width: number; height: number },
  labels: Ref<Array<string>>
) {
  const xScale = ref(null);
  const yScale = ref(null);

  const computedStartOnZero = computed(() => {
    // Comes from `@/mixins/negative-values`
    // If has negative values, this has to be `false`.
    if (hasNegativeValues.value) return false;
    return startOnZero.value;
  });

  const allValues = computed(() =>
    flatValues(data.value || []).filter((v) => v != null)
  );

  const maxValue = computed(() => {
    return Math.max(...allValues.value);
  });

  const minValue = computed(() => {
    if (computedStartOnZero.value) return 0;
    return Math.min(...allValues.value);
  });

  const setXScale = async () => {
    await nextTick();
    xScale.value = scaleBand()
      .range([0, containerSize.width])
      .domain(labels.value?.map((v) => v));
  };

  const setYScale = async () => {
    await nextTick();
    yScale.value = scaleLinear()
      .rangeRound([0, containerSize.height])
      .domain([maxValue.value, minValue.value]);
  };

  watch(
    [containerSize, allValues],
    () => {
      setXScale();
      setYScale();
    },
    {
      immediate: true,
      deep: true
    }
  );

  return { computedStartOnZero, maxValue, minValue, xScale, yScale };
}
