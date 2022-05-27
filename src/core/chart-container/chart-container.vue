<template>
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
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  ref,
  toRefs,
  watch,
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
    const root = ref(null);
    const { margins } = toRefs(props);

    const _width = ref(0);
    const _height = ref(0);

    const computedMargin = computed(() => ({
      // Default values
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      // Prop overrides
      ...props.margins,
    }));

    const containerSize = computed(() => {
      const width =
        _width.value - computedMargin.value.left - computedMargin.value.right;
      const height =
        _height.value - computedMargin.value.top - computedMargin.value.bottom;
      return {
        width: width > 0 ? width : 0,
        height: height > 0 ? height : 0,
        outerWidth: width,
        outerHeight: height,
      };
    });

    function updateContainerSize(forceUpdate: boolean) {
      const { width, height } = root.value.getBoundingClientRect();

      if (forceUpdate || _width !== width || _height !== height) {
        _width.value = width;
        _height.value = height;

        ctx.emit('resize', containerSize.value);
      }
    }

    watch(margins, () => updateContainerSize(true));

    onMounted(() => updateContainerSize(true));
    onUpdated(updateContainerSize);

    return { root, computedMargin, containerSize };
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
