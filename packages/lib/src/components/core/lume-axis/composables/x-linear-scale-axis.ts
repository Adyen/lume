import { computed, Ref } from 'vue';
import { ScaleLinear } from 'd3';

import { AxisOptions } from '@/composables/options';
import { AXIS_GHOST_PADDING, AXIS_TEXT_HEIGHT } from '@/utils/constants';
import { AxisMixin } from '../types';

const useLinearScaleAxis: AxisMixin = function (
  scale: Ref<ScaleLinear<number, number>>,
  containerSize: Ref<{ width: number; height: number }>,
  options: Ref<AxisOptions>
) {
  const tickWidth = computed(() => {
    const ticks = scale.value.ticks();
    return ticks.length > 1 ? scale.value(ticks[1]) - scale.value(ticks[0]) : 0;
  });

  function getTickGroupAttributes(value: number) {
    return {
      transform: `translate(${scale.value(value)}, 0)`,
    };
  }

  function getTickGhostAttributes() {
    const height =
      options.value.tickPadding + AXIS_TEXT_HEIGHT + AXIS_GHOST_PADDING;
    return {
      height,
      width: tickWidth.value,
      x: -(tickWidth.value / 2),
    };
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
