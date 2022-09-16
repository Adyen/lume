import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';

// Either the result of `getBoundingClientRect` or an empty object (initial state)
type Dimensions = DOMRect | Record<string, never>;

export function useResizeObserver() {
  // create a new ref,
  // which needs to be attached to an element in a template
  const resizeRef = ref<Element>();
  const resizeState = reactive<{ dimensions: Dimensions }>({
    dimensions: {},
  });

  const observer = new ResizeObserver((entries) => {
    // called initially and on resize
    entries.forEach((entry) => {
      resizeState.dimensions = entry.contentRect;
    });
  });

  onMounted(() => {
    observer.observe(resizeRef.value);
  });

  onBeforeUnmount(() => {
    observer.unobserve(resizeRef.value);
  });

  // return to make them available to whoever consumes this hook
  return { resizeState, resizeRef };
}
