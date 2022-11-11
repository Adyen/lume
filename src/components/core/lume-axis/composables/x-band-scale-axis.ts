import { computed, Ref } from 'vue';
import { ScaleBand } from 'd3';

import { AxisOptions } from '@/composables/options';
import { AxisMixin } from '../types';

const TEXT_HEIGHT = 12;
const BOTTOM_PADDING = 8;

const useBandScaleAxis: AxisMixin = function (
  scale: Ref<ScaleBand<number | string>>,
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
      height: options.value.tickPadding + TEXT_HEIGHT + BOTTOM_PADDING,
    };
  }

  function getGridLinesAttributes() {
    const halfStep = scale.value.step() / 2;

    return {
      x1: halfStep,
      x2: halfStep,
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
