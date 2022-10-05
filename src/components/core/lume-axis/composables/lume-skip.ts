import { computed, ref, Ref, watch } from 'vue';

import { Scale } from '@/composables/scales';

const SAFETY_MARGIN = 0.15; // 15% of the average width

/**
 * Composable for axis label skipping logic.
 *
 * @param scale A d3 scale.
 * @param tickRefs Template reference to the tick text elements
 * @param skipNumber Optional amount of ticks to skip
 */
export function useSkip(
  scale: Ref<Scale>,
  tickRefs: Ref<Array<SVGTextElement>>,
  skipNumber?: true | number
) {
  const avgLabelWidth = ref<number>();

  const scaleWidth = computed(() => Math.max(...scale.value.range()));
  const tickCount = computed(() => tickRefs.value.length);

  function setAvgLabelWidth() {
    if (!tickRefs.value) return;
    const labelWidthSum = tickRefs.value.reduce(
      (sum, label) => sum + label.getBoundingClientRect().width,
      0
    );
    const averageValue = Math.ceil(labelWidthSum / tickCount.value);

    // Add safety margin to make sure the bigger labels don't overlap
    avgLabelWidth.value = averageValue + averageValue * SAFETY_MARGIN;
  }

  function showTick(index: number) {
    if (!tickRefs.value) return true;

    const tickCount = tickRefs.value.length;

    if (index === 0) return true;

    const step = scaleWidth.value / tickCount;
    const skip =
      (typeof skipNumber === 'number' && skipNumber > 0 && skipNumber + 1) ||
      Math.ceil(avgLabelWidth.value / step);

    return index % skip === 0;
  }

  watch(tickRefs, setAvgLabelWidth);

  return { showTick };
}
