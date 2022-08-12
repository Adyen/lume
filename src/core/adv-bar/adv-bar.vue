<template>
  <rect
    class="bar"
    :class="[
      fillClass,
      {
        'bar--transition-width': shouldTransitionWidth,
        'bar--transition-height': shouldTransitionHeight,
        'bar--negative': isNegative,
        'bar--faded': isFaded,
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
import {
  computed,
  defineComponent,
  PropType,
  toRefs,
} from '@vue/composition-api';

import { useBarTransition } from './mixins/bar-transition';

type TransitionProperty = 'width' | 'height';

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
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    fillClass: {
      type: String,
      required: true,
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
      type: [String, Boolean] as PropType<TransitionProperty | false>,
      default: false,
    },
  },
  setup(props) {
    const { x, y, width, height, transition } = toRefs(props);

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
