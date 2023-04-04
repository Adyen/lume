import { Ref } from 'vue';
import { ScaleLinear } from 'd3';

import { AxisOptions } from '@/composables/options';
import { AxisMixin } from '../types';

const useLinearScaleAxis: AxisMixin = function (
  scale: Ref<ScaleLinear<number, number>>,
  containerSize: Ref<{ width: number; height: number }>,
  options: Ref<AxisOptions>
) {
  function getTickGroupAttributes(value: number) {
    return {
      transform: `translate(0, ${scale.value(value)})`,
    };
  }

  function getTickGhostAttributes() {
    return {};
  }

  function getGridLinesAttributes() {
    return {
      x1: containerSize.value.width,
    };
  }

  function getTickLabelAttributes() {
    return {
      x: -options.value.tickPadding,
      dy: '0.4em',
      'text-anchor': 'end',
    };
  }

  return {
    getGridLinesAttributes,
    getTickGhostAttributes,
    getTickGroupAttributes,
    getTickLabelAttributes,
  };
};

export default useLinearScaleAxis;
