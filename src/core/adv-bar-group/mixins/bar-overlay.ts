import { computed, Ref } from '@vue/composition-api';
import { ScaleBand } from 'd3-scale';

import { Scale } from '@/mixins/scales';

import { Orientation, ORIENTATIONS } from '@/constants';

export function useBarOverlay(
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation?: Ref<Orientation>
) {
  const isHorizontal = computed(
    () => orientation?.value === ORIENTATIONS.HORIZONTAL
  );

  const ghostCorrection = computed(() => {
    const scale =
      isHorizontal?.value === true
        ? (yScale.value as ScaleBand<string | number>)
        : (xScale.value as ScaleBand<string | number>);

    return (scale.step() * scale.paddingInner()) / 2;
  });

  function getOverlayConfig(index: number) {
    if (!xScale.value || !yScale.value) return {};

    const scale = isHorizontal?.value
      ? (yScale.value as ScaleBand<string | number>)
      : (xScale.value as ScaleBand<string | number>);
    const domain = scale.domain();

    return isHorizontal?.value
      ? {
          transform: `translate(0, ${
            scale(domain[index]) - ghostCorrection.value
          })`,
          width: Math.max(...xScale.value.range()),
          height: scale.step(),
        }
      : {
          transform: `translate(${
            scale(domain[index]) - ghostCorrection.value
          }, 0)`,
          width: scale.step(),
          height: Math.max(...yScale.value.range()),
        };
  }

  return { getOverlayConfig };
}
