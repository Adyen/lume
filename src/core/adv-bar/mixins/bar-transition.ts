import { computed, onMounted, ref, Ref, watch } from '@vue/composition-api';

export function useBarTransition(
  x: Ref<number>,
  y: Ref<number>,
  width: Ref<number>,
  height: Ref<number>
) {
  const computedHeight = ref(0);
  const computedWidth = ref(0);

  const transformOrigin = computed(() => {
    return `${x.value + width.value / 2}px ${y.value + height.value / 2}px`;
  });

  onMounted(() => {
    computedWidth.value = width.value;
    computedHeight.value = height.value;
  });

  watch(width, (value: number) => (computedWidth.value = value));
  watch(height, (value: number) => (computedHeight.value = value));

  return { computedWidth, computedHeight, transformOrigin };
}
