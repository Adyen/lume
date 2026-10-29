import { computed, Ref } from 'vue';
import { ScaleBand } from 'd3';

import type { AxisOptions } from '@/types/options';
import { AXIS_GHOST_PADDING } from '@/utils/constants';
import { AxisMixin } from '../types';
import { isTickStartAligned } from '../helpers';

const useBandScaleAxis: AxisMixin = function (
  scale: Ref<ScaleBand<number | string>>,
  containerSize: Ref<{ width: number; height: number }>,
  options: Ref<AxisOptions>
) {
  const paddingCorrection = computed(() => {
    return (scale.value.step() * scale.value.paddingInner()) / 2;
  });

  function getTickGroupAttributes(value: number | string, index: number) {
    return {
      transform: `translate(0, ${
        (scale.value(index) ?? scale.value(value)) - paddingCorrection.value
      })`,
    };
  }

  function getTickGhostAttributes(
    textElement: SVGTextElement,
    maxLabelWidth?: number
  ) {
    // If label element not yet rendered, assume one scale step, otherwise get its width.
    const ownWidth = textElement ? textElement.getComputedTextLength?.() : 42;
    const labelWidth = isTickStartAligned(options.value, maxLabelWidth)
      ? maxLabelWidth
      : ownWidth;
    const width = labelWidth + options.value.tickPadding + AXIS_GHOST_PADDING;
    return {
      x: -width,
      width,
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

  function getTickLabelAttributes(maxLabelWidth?: number) {
    const isStart = isTickStartAligned(options.value, maxLabelWidth);
    return {
      x: -(options.value.tickPadding + (isStart ? maxLabelWidth : 0)),
      y: scale.value.step() / 2,
      'text-anchor': isStart ? 'start' : 'end',
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
