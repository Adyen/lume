<template>
  <div
    ref="resizeRef"
    class="adv-chart-container"
    data-j-chart-container
  >
    <slot name="header" />

    <svg
      ref="root"
      class="adv-chart-container__svg"
      :class="{
        'adv-chart-container__svg--transparent': transparentBackground,
      }"
      data-j-chart-container__root
      @mouseleave="$emit('mouseleave', $event)"
    >
      <g
        :transform="`translate(${computedMargins.left}, ${computedMargins.top})`"
        class="adv-chart-container__group"
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
import { computed, defineComponent, ref, toRefs, watchEffect } from 'vue';

import { useResizeObserver } from '@/mixins/resize';

const BASE_MARGINS = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

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
    const { margins } = toRefs(props);

    const root = ref<SVGElement>(null);
    const { resizeRef, resizeState } = useResizeObserver();

    const computedMargins = computed(() => ({
      ...BASE_MARGINS, // Default values
      ...margins.value, // Prop overrides
    }));

    watchEffect(() => {
      if (!root.value) return;

      const { width } = resizeState.dimensions;
      const { height } = root.value.getBoundingClientRect();

      if (!width || !height) return;

      const contentWidth =
        width - computedMargins.value.left - computedMargins.value.right;
      const contentHeight =
        height - computedMargins.value.top - computedMargins.value.bottom;

      const containerSize = {
        width: contentWidth > 0 ? contentWidth : 0,
        height: contentHeight > 0 ? contentHeight : 0,
        outerWidth: width,
        outerHeight: height,
      };

      ctx.emit('resize', containerSize);
    });

    return { computedMargins, resizeRef, root };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
