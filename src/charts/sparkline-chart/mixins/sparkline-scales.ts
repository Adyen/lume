import { computed, ref, watch } from '@vue/composition-api';
import { scaleLinear } from 'd3-scale';
import { Data, DatasetValueObject } from '@/types/dataset';
import { flatValues } from '@/utils/helpers';

export function useSparklineScales(
  data: Data<DatasetValueObject>,
  containerSize: { width: number; height: number }
) {
  const xScale = ref(null);
  const yScale = ref(null);

  const allValues = flatValues(data).filter((v) => v != null);

  const maxValue = computed(() => {
    return Math.max(...allValues);
  });

  const minValue = computed(() => {
    return Math.min(...allValues);
  });

  const getXScale = () => {
    xScale.value = scaleLinear()
      .range([0, containerSize.width])
      .domain([0, data[0].values.length - 1]);
  };

  const getYScale = () => {
    yScale.value = scaleLinear()
      .rangeRound([0, containerSize.height])
      .domain([maxValue.value, minValue.value]);
  };

  watch(containerSize, getXScale);
  watch(containerSize, getYScale);

  return { xScale, yScale, minValue, maxValue };
}
