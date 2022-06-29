import { computed, Ref } from '@vue/composition-api';
import { AxisMixin } from './types';

const useBandScaleAxis: AxisMixin = function (
  scale: Ref<any>,
  containerSize: Ref<{ width: number; height: number }>
) {
  const paddingCorrection = computed(() => {
    return (scale.value.step() * scale.value.paddingInner()) / 2;
  });

  function getTickGroupAttributes(value: number | string) {
    return {
      transform: `translate(${
        scale.value(value) - paddingCorrection.value
      }, 0)`,
    };
  }

  function getTickGhostAttributes() {
    return {
      width: scale.value.step(),
      height: 24,
    };
  }

  function getGridLinesAttributes() {
    return {
      x1: scale.value.step() / 2,
      x2: scale.value.step() / 2,
      y1: -containerSize.value.height, // Negative height means it goes from bottom to top
    };
  }

  function getTickLabelAttributes() {
    return {
      x: scale.value.step() / 2,
      y: 8,
      dy: '0.8em',
      'text-anchor': 'middle',
    };
  }

  return {
    getGridLinesAttributes,
    getTickGhostAttributes,
    getTickGroupAttributes,
    getTickLabelAttributes,
  };
};

export default useBandScaleAxis;
