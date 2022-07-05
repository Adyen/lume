import { Ref } from '@vue/composition-api';
import { AxisOptions } from '@/mixins/options';
import { AxisMixin } from './types';

const useLinearScaleAxis: AxisMixin = function (
  scale: Ref<any>,
  containerSize: Ref<{ width: number; height: number }>,
  options: Ref<AxisOptions>
) {
  function getTickGroupAttributes(value: number | string) {
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
