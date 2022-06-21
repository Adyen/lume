<template>
  <div
    ref="resizeRef"
    class="u-width-full u-height-full"
  >
    <svg
      ref="root"
      class="container"
      :class="{ 'container--transparent-background': transparentBackground }"
    >
      <g
        :transform="`translate(${computedMargin.left}, ${computedMargin.top})`"
        class="container__group"
      >
        <slot :container-size="containerSize" />
      </g>
    </svg>
    <slot name="extra" />
  </div>
</template>

<script lang="ts">
import { useResizeObserver } from '@/mixins/resize';
import { computed, defineComponent, ref, toRefs } from '@vue/composition-api';

export default defineComponent({
  props: {
    margins: {
      type: Object,
      default: () => ({}),
    },
    transparentBackground: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const root = ref(null);
    const { margins } = toRefs(props);

    const { resizeRef, resizeState } = useResizeObserver();

    const computedMargin = computed(() => ({
      // Default values
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      // Prop overrides
      ...margins.value,
    }));

    const containerSize = computed(() => {
      const { width, height } = resizeState.dimensions;
      const _width =
        width - computedMargin.value.left - computedMargin.value.right;
      const _height =
        height - computedMargin.value.top - computedMargin.value.bottom;

      const sizeObject = {
        width: _width > 0 ? _width : 0,
        height: _height > 0 ? _height : 0,
        outerWidth: width,
        outerHeight: height,
      };

      ctx.emit('resize', sizeObject);

      return sizeObject;
    });

    return { root, resizeRef, computedMargin, containerSize };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

.container {
  overflow: visible;
  background-color: $chart-background-color;
  width: 100%;
  height: 100%;

  &--transparent-background {
    background-color: transparent;
  }

  &__group {
    transition-property: transform;
    transition-timing-function: ease-in-out;
    transition-duration: $chart-transition-time;
  }
}
</style>
