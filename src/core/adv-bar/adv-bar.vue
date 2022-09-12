<template>
  <rect
    class="adv-bar"
    :class="[
      ...computedClasses,
      {
        'adv-bar--negative': isNegative,
        'adv-bar--faded': isFaded,
        'adv-bar--transition-width': shouldTransitionWidth,
        'adv-bar--transition-height': shouldTransitionHeight,
      },
    ]"
    :style="{ transformOrigin: transformOrigin }"
    :x="x"
    :y="y"
    :width="computedWidth"
    :height="computedHeight"
    data-j-bar
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

import { useBarTransition } from './mixins/bar-transition';

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

    const computedWidth = shouldTransitionWidth.value
      ? transitionProps.computedWidth
      : width;
    const computedHeight = shouldTransitionHeight.value
      ? transitionProps.computedHeight
      : height;
    const transformOrigin =
      shouldTransitionWidth.value || shouldTransitionHeight.value
        ? transitionProps.transformOrigin
        : null;

    return {
      computedClasses,
      computedWidth,
      computedHeight,
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
