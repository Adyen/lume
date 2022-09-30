<template>
  <rect
    class="lume-bar"
    :class="[
      ...computedClasses,
      {
        'lume-bar--negative': isNegative,
        'lume-bar--faded': isFaded,
        'lume-bar--transition-width': shouldTransitionWidth,
        'lume-bar--transition-height': shouldTransitionHeight,
      },
    ]"
    :style="{ transformOrigin: transformOrigin }"
    :x="computedX"
    :y="computedY"
    :width="computedWidth"
    :height="computedHeight"
    data-j-bar
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

import { useBarSizing } from './composables/bar-sizing';
import { useBarTransition } from './composables/bar-transition';

type BarTransitionProperty = 'width' | 'height';

export default defineComponent({
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    classList: {
      type: [String, Array] as PropType<string | Array<string>>,
      default: '',
    },
    isFaded: {
      type: Boolean,
      default: false,
    },
    isNegative: {
      type: Boolean,
      default: false,
    },
    transition: {
      type: [String, Boolean] as PropType<BarTransitionProperty | false>,
      default: false,
    },
  },
  setup(props) {
    const { x, y, width, height, transition, classList } = toRefs(props);

    const computedClasses = computed(() => {
      if (typeof classList.value === 'string') return [classList.value];
      return classList.value;
    });

    const shouldTransitionWidth = computed(() => transition.value === 'width');
    const shouldTransitionHeight = computed(
      () => transition.value === 'height'
    );

    const transitionProps = useBarTransition(x, y, width, height);

    const { computedX, computedY, shouldHaveMinWidth, shouldHaveMinHeight } =
      useBarSizing(x, y, width, height);

    const computedWidth = computed(() => {
      if (shouldHaveMinWidth.value) return 1;

      return (
        shouldTransitionWidth.value ? transitionProps.computedWidth : width
      ).value;
    });

    const computedHeight = computed(() => {
      if (shouldHaveMinHeight.value) return 1;

      return (
        shouldTransitionHeight.value ? transitionProps.computedHeight : height
      ).value;
    });

    const transformOrigin =
      shouldTransitionWidth.value || shouldTransitionHeight.value
        ? transitionProps.transformOrigin
        : null;

    return {
      computedClasses,
      computedWidth,
      computedHeight,
      computedX,
      computedY,
      shouldTransitionWidth,
      shouldTransitionHeight,
      transformOrigin,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
