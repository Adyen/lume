import { ref } from 'vue';

import { AlluvialExtents, AlluvialLabelMargins } from '@/types/alluvial';
import { ContainerSize } from '@/types/size';

function computeExtents(
  size: ContainerSize,
  labelMargins?: AlluvialLabelMargins
) {
  return {
    x0: 0 + (labelMargins ? labelMargins.left : 0),
    y0: 0 + (labelMargins ? labelMargins.top : 0),
    x1: size.width - (labelMargins ? labelMargins.right : 0),
    y1: size.height - (labelMargins ? labelMargins.bottom : 0),
  };
}

export function useAlluvialExtents(containerSize: ContainerSize) {
  const extents = ref<AlluvialExtents>(computeExtents(containerSize));

  function updateExtents(labelMargins: AlluvialLabelMargins) {
    extents.value = computeExtents(containerSize, labelMargins);
  }

  return { extents, updateExtents };
}
