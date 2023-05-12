import { computed, Ref } from 'vue';
import { ScaleLinear } from 'd3';

import { AxisOptions } from '@/composables/options';
import { AxisMixin } from '../types';

const useLinearScaleAxis: AxisMixin = function (
  scale: Ref<ScaleLinear<number, number>>,
  containerSize: Ref<{ width: number; height: number }>,
  options: Ref<AxisOptions>
) {
  const tickHeight = computed(() => {
    const ticks = scale.value.ticks();
    return ticks.length > 1 ? scale.value(ticks[1]) - scale.value(ticks[0]) : 0;
  });

  function getTickGroupAttributes(value: number) {
    return {
      transform: `translate(0, ${scale.value(value)})`,
    };
  }

  function getTickGhostAttributes(textRef: SVGTextElement) {
    const width =
      (textRef?.getComputedTextLength?.() || 0) + options.value.tickPadding * 2;
    return {
      width,
      height: tickHeight.value,
      x: -width,
      y: -(tickHeight.value / 2),
    };
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
