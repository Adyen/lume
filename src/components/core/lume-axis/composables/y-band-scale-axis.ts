import { computed, Ref } from 'vue';
import { ScaleBand } from 'd3';

import { AxisOptions } from '@/composables/options';
import { AxisMixin } from '../types';

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
      transform: `translate(0, ${
        scale.value(value) - paddingCorrection.value
      })`,
    };
  }

  function getTickGhostAttributes() {
    return {
      x: -43,
      width: 42, // hardcoded for now
      height: scale.value.step(),
    };
  }

  function getGridLinesAttributes() {
    const halfStep = scale.value.step() / 2;

    return {
      y1: halfStep,
      y2: halfStep,
      x1: containerSize.value.width,
    };
  }

  function getTickLabelAttributes() {
    return {
      x: -options.value.tickPadding,
      y: scale.value.step() / 2,
      'text-anchor': 'end',
      'alignment-baseline': 'middle',
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
