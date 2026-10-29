import { computed, Ref } from 'vue';
import { ScaleLinear } from 'd3';

import type { AxisOptions } from '@/types/options';
import { AxisMixin } from '../types';
import { isTickStartAligned } from '../helpers';
import { AXIS_GHOST_PADDING } from '@/utils/constants';

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

  function getTickGhostAttributes(
    textElement: SVGTextElement,
    maxLabelWidth?: number
  ) {
    const labelWidth = isTickStartAligned(options.value, maxLabelWidth)
      ? maxLabelWidth
      : textElement?.getComputedTextLength?.() || 0;
    const width = labelWidth + options.value.tickPadding + AXIS_GHOST_PADDING;
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

  function getTickLabelAttributes(maxLabelWidth?: number) {
    const isStart = isTickStartAligned(options.value, maxLabelWidth);
    return {
      x: -(options.value.tickPadding + (isStart ? maxLabelWidth : 0)),
      dy: '0.4em',
      'text-anchor': isStart ? 'start' : 'end',
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
