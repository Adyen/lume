import { computed } from 'vue';
import { line, ScaleBand, ScaleLinear } from 'd3';
import { getScaleStep, isBandScale } from '@/utils/helpers';

export const useLineValues = (firstIndex, values, xScale, yScale) => {
  const xAxisOffset = computed(() => getScaleStep(xScale) / 2);

  function findLinearX(_: unknown, index: number) {
    return (xScale as ScaleLinear<number, number>)(firstIndex + (index - 1));
  }

  // Note that d3's line() will pass the index as the second argument, so we need the '_' first argument to reach it
  function findBandX(_: unknown, index: number) {
    return (
      (xScale as ScaleBand<string | number>)(
        xScale.domain()[firstIndex + (index - 1)]
      ) + xAxisOffset.value
    );
  }

  const pathDefinition = computed(() => {
    const lineFn = line<number>()
      .x(isBandScale(xScale) ? findBandX : findLinearX)
      .y((d) => yScale(d));

    return lineFn(values);
  });

  return { pathDefinition };
};
