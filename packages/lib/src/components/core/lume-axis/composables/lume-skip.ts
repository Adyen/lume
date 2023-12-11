import { computed, ref, Ref, watch } from 'vue';

import { AxisOptions } from '@/composables/options';
import { Scale } from '@/composables/scales';

const SAFETY_MARGIN = 0.2; // 20% of the average width

/**
 * Composable for axis label skipping logic.
 *
 * @param scale A d3 scale.
 * @param tickRefs Template reference to the tick text elements
 * @param options The axis options.
 */
export function useSkip(
  scale: Ref<Scale>,
  tickRefs: Ref<Array<{ ref: SVGTextElement }>>,
  options: Ref<AxisOptions>
) {
  const avgLabelWidth = ref<number>();

  const scaleWidth = computed(() => Math.max(...scale.value.range()));
  const tickCount = computed(() => tickRefs.value.length);

  function setAvgLabelWidth() {
    if (!tickRefs.value) return;
    const labelWidthSum = tickRefs.value.reduce(
      (sum, label) => sum + label.ref.getBoundingClientRect().width,
      0
    );
    const averageValue = Math.ceil(labelWidthSum / tickCount.value);

    // Add safety margin to make sure the bigger labels don't overlap
    avgLabelWidth.value = averageValue + averageValue * SAFETY_MARGIN;
  }

  function showTick(index: number) {
    if (!tickRefs.value) return true;

    const skipNumber = options.value.skip;
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
