import { computed, ComputedRef } from 'vue';
import { area } from 'd3-shape';
import { ScaleLinear } from 'd3-scale';

import { Data, DatasetValueObject } from '@/types/dataset';

export function useSparklineArea(data: ComputedRef<Data<DatasetValueObject>>) {
  const areaPathDefinition = computed(
    () =>
      function (
        xScale: ScaleLinear<number, number>,
        yScale: ScaleLinear<number, number>
      ) {
        if (!xScale || !yScale) return;
        const sparklineValues = data.value[0].values;
        return area<DatasetValueObject>()
          .x((_, i) => xScale(i))
          .y0(yScale(Math.min(...yScale.domain())))
          .y1((d) => yScale(d.value))(sparklineValues);
      }
  );

  return { areaPathDefinition };
}
