import { computed, onMounted, ref, Ref, watch } from '@vue/composition-api';

export function useBarTransition(
  x: Ref<number>,
  y: Ref<number>,
  width: Ref<number>,
  height: Ref<number>
) {
  // Have width/height start at 0
  const computedWidth = ref(0);
  const computedHeight = ref(0);

  const transformOrigin = computed(() => {
    // Calculates the middle point of a bar so that it can be rotated 180 deg
    return `${x.value + width.value / 2}px ${y.value + height.value / 2}px`;
  });

  onMounted(() => {
    // Set computed width/height to their supposed value
    computedWidth.value = width.value;
    computedHeight.value = height.value;
  });

  // Handles width/height changes after the initial render
  watch(width, (value) => (computedWidth.value = value));
  watch(height, (value) => (computedHeight.value = value));

  return { computedWidth, computedHeight, transformOrigin };
}
