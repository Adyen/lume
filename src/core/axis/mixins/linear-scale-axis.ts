import { Ref } from '@vue/composition-api';

function useLinearScaleAxis(
  scale: Ref<any>,
  containerSize: Ref<{ width: number; height: number }>
) {
  function getTickGroupAttributes(value: number | string) {
    return { transform: `translate(0, ${scale.value(value)})` };
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
      x: -8,
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
}

export default useLinearScaleAxis;
