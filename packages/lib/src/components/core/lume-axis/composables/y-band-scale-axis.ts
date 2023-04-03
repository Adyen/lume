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

  function getTickGroupAttributes(value: number | string, index: number) {
    return {
      transform: `translate(0, ${
        (scale.value(index) ?? scale.value(value)) - paddingCorrection.value
      })`,
    };
  }

  function getTickGhostAttributes(textRef: SVGTextElement) {
    // If label element not yet rendered, assume one scale step, otherwise get its width.
    const width =
      (textRef ? textRef.getComputedTextLength?.() : 42) +
      options.value.tickPadding * 2;
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
