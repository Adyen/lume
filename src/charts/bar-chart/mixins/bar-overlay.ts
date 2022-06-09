import { computed, ComputedRef } from '@vue/composition-api';

export function useBarOverlay(
  isHorizontal: ComputedRef<boolean>,
  xScale,
  yScale,
  containerSize: { width: number; height: number }
) {
  const ghostCorrection = computed(() => {
    const scale = isHorizontal.value ? yScale.value : xScale.value;
    return (scale.step() * scale.paddingInner()) / 2;
  });

  function getOverlayConfig(index: number) {
    if (!xScale.value || !yScale.value) return {};
    const scale = isHorizontal.value ? yScale.value : xScale.value;
    const domain = scale.domain();
    return isHorizontal.value
      ? {
          transform: `translate(0, ${scale(domain[index]) -
            ghostCorrection.value})`,
          width: containerSize.width,
          height: scale.step(),
        }
      : {
          transform: `translate(${scale(domain[index]) -
            ghostCorrection.value}, 0)`,
          width: scale.step(),
          height: containerSize.height,
        };
  }

  return { getOverlayConfig };
}
