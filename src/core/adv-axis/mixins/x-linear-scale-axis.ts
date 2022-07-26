import { Ref } from '@vue/composition-api';
import { AxisOptions } from '@/mixins/options';
import { AxisMixin } from '../types';

const useLinearScaleAxis: AxisMixin = function (
  scale: Ref<any>,
  containerSize: Ref<{ width: number; height: number }>,
  options: Ref<AxisOptions>
) {
  function getTickGroupAttributes(value: number | string) {
    return {
      transform: `translate(${scale.value(value)}, 0)`,
    };
  }

  function getTickGhostAttributes() {
    return {};
  }

  function getGridLinesAttributes() {
    return {
      y1: -containerSize.value.height,
    };
  }

  function getTickLabelAttributes() {
    return {
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

export default useLinearScaleAxis;
