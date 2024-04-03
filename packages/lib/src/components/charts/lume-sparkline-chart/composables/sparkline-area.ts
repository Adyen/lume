import { computed, ComputedRef } from 'vue';
import { area } from 'd3';

import { Scale } from '@/composables/scales';
import type { DatasetValueObject, InternalData } from '@/types/dataset';
import { isBandScale } from '@/utils/helpers';

export function useSparklineArea(data: ComputedRef<InternalData>) {
  const areaPathDefinition = computed(
    () =>
      function (xScale: Scale, yScale: Scale) {
        if (!xScale || !yScale || isBandScale(xScale) || isBandScale(yScale))
          return;

        const sparklineValues = data.value[0].values;
        return area<DatasetValueObject>()
          .x((_, i) => xScale(i))
          .y0(yScale(Math.min(...yScale.domain())))
          .y1((d) => yScale(d.value))(sparklineValues);
      }
  );

  return { areaPathDefinition };
}
