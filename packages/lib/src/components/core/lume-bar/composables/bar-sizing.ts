import { computed, Ref } from 'vue';

/**
 * Provides bar sizing logic to account for certain edge cases, like:
 *  - When a data point is very small compared to others, but not 0, the bar
 *    should display with a minimum of a 1px height/width
 *
 * @param x Bar x position.
 * @param y Bar y position.
 * @param width Bar width value.
 * @param height Bar height value.
 * @returns An object with computed positions (x, y), and indicators of
 *  if width/height should have a 1px minimum.
 */
export function useBarSizing(
  x: Ref<number>,
  y: Ref<number>,
  width: Ref<number>,
  height: Ref<number>
) {
  const shouldHaveMinWidth = computed(() => width.value > 0 && width.value < 1);
  const shouldHaveMinHeight = computed(
    () => height.value > 0 && height.value < 1
  );

  const computedX = computed(
    () => (shouldHaveMinWidth.value ? x.value - 0.5 : x.value) // draws the 1px bar closer to the axis
  );

  const computedY = computed(
    () => (shouldHaveMinHeight.value ? y.value - 0.5 : y.value) // draws the 1px bar closer to the axis
  );

  return { computedX, computedY, shouldHaveMinWidth, shouldHaveMinHeight };
}
