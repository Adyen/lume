<template>
  <div
    ref="resizeRef"
    class="adv-chart-container"
    data-j-chart-container
  >
    <slot name="header" />

    <svg
      ref="root"
      class="container"
      :class="{ 'container--transparent-background': transparentBackground }"
      @mouseleave="$emit('mouseleave', $event)"
    >
      <g
        :transform="`translate(${computedMargin.left}, ${computedMargin.top})`"
        class="container__group"
        data-j-chart-container__group
      >
        <slot />
      </g>
    </svg>

    <slot name="footer" />

    <slot name="extra" />
  </div>
</template>

<script lang="ts">
import { useResizeObserver } from '@/mixins/resize';
import {
  computed,
  defineComponent,
  ref,
  toRefs,
  watchEffect,
} from '@vue/composition-api';

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
    const root = ref<SVGElement>(null);
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

    watchEffect(() => {
      if (!root.value) return;

      const { width } = resizeState.dimensions;
      const { height } = root.value.getBoundingClientRect();

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
    });

    return {
      root,
      resizeRef,
      computedMargin,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

.adv-chart-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.container {
  overflow: visible;
  background-color: $chart-background-color;
  width: 100%;
  flex: 1;

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
