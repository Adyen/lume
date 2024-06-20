<template>
  <div
    ref="resizeRef"
    class="lume-chart-container"
    :class="{
      'lume-chart-container--minimum': !noMinSize,
    }"
    data-j-chart-container
  >
    <slot name="header" />

    <svg
      ref="root"
      class="lume-chart-container__svg"
      :class="{
        'lume-chart-container__svg--transparent': transparentBackground,
      }"
      :height="svgHeight"
      data-j-chart-container__root
      @click="emit('click', $event)"
      @mouseenter="emit('mouseenter', $event)"
      @mouseleave="emit('mouseleave', $event)"
    >
      <g
        :transform="`translate(${margins.left}, ${margins.top})`"
        class="lume-chart-container__group"
        data-j-chart-container__group
      >
        <slot />
      </g>
    </svg>

    <slot name="footer" />

    <slot name="extra" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref, toRefs, watchEffect } from 'vue';

import { orientationValidator } from '@/composables/props';
import { useResizeObserver } from '@/composables/resize';
import { ORIENTATIONS } from '@/utils/constants';
import type { InternalMargins, Orientation } from '@/types/utils';
import type { ContainerSize } from '@/types/size';

const props = defineProps({
  margins: {
    type: Object as PropType<InternalMargins>,
    required: true,
  },
  containerSize: {
    type: Object as PropType<ContainerSize>,
    default: () => ({ width: 0, height: 0 }),
  },
  transparentBackground: {
    type: Boolean,
    default: false,
  },
  noMinSize: {
    type: Boolean,
    default: false,
  },
  orientation: {
    type: String as PropType<Orientation>,
    default: ORIENTATIONS.VERTICAL,
    validator: orientationValidator,
  },
});

const emit = defineEmits<{
  (e: 'click', p: MouseEvent): void;
  (e: 'mouseenter' | 'mouseleave', p: MouseEvent): void;
  (e: 'resize', value: ContainerSize): void;
}>();

const { margins, containerSize } = toRefs(props);

const root = ref<SVGElement>(null);
const { resizeRef, resizeState } = useResizeObserver();

// Required for horizontal charts
const svgHeight = computed(
  () => containerSize.value.height + margins.value.top + margins.value.bottom
);

watchEffect(() => {
  if (!root.value) return;

  const { width } = resizeState.dimensions;
  const { height } = root.value.getBoundingClientRect();

  if (!width || (props.orientation === ORIENTATIONS.VERTICAL && !height)) {
    return;
  }

  const contentWidth = width - margins.value.left - margins.value.right;
  const contentHeight = height - margins.value.top - margins.value.bottom;

  const _containerSize = {
    width: contentWidth > 0 ? contentWidth : 0,
    height: contentHeight > 0 ? contentHeight : 0,
    outerWidth: width,
    outerHeight: height,
  };

  emit('resize', _containerSize);
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
