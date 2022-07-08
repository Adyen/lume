import { computed, Ref } from '@vue/composition-api';
import { AxisOptions } from '@/mixins/options';
import { AxisMixin } from '../types';

const useBandScaleAxis: AxisMixin = function (
  scale: Ref<any>,
  containerSize: Ref<{ width: number; height: number }>,
  options: Ref<AxisOptions>
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
      height: options.value.tickPadding + 12 + 8, // Padding plus text height plus 8 bottom padding
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
      y: options.value.tickPadding,
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
