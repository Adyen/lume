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
    const domain = xScale.value.domain();
    return isHorizontal.value
      ? {
          transform: `translate(0, ${yScale.value(index) -
            ghostCorrection.value})`,
          width: containerSize.width,
          height: yScale.value.step(),
        }
      : {
          transform: `translate(${xScale.value(domain[index]) -
            ghostCorrection.value}, 0)`,
          width: xScale.value.step(),
          height: containerSize.height,
        };
  }

  return { getOverlayConfig };
}
