<template>
  <svg
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

<script>
export default {
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
  data: () => ({
    width: 0,
    height: 0,
  }),
  computed: {
    computedMargin() {
      return {
        // Default values
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        // Prop overrides
        ...this.margins,
      };
    },
    containerSize() {
      const width =
        this.width - this.computedMargin.left - this.computedMargin.right;
      const height =
        this.height - this.computedMargin.top - this.computedMargin.bottom;
      return {
        width: width > 0 ? width : 0,
        height: height > 0 ? height : 0,
        outerWidth: this.width,
        outerHeight: this.height,
      };
    },
  },
  watch: {
    margins: {
      handler() {
        this.updateContainerSize(true);
      },
      deep: true,
    },
  },
  mounted() {
    this.updateContainerSize(true);
  },
  updated() {
    this.updateContainerSize();
  },
  methods: {
    updateContainerSize(forceUpdate) {
      const { width, height } = this.$el.getBoundingClientRect();

      if (forceUpdate || this.width !== width || this.height !== height) {
        this.width = width;
        this.height = height;

        this.$emit('resize', this.containerSize);
      }
    },
  },
};
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
