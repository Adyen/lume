// @vue/component
export default {
  computed: {
    ghostCorrection() {
      const scale = this.isHorizontal ? this.yScale : this.xScale;
      return (scale.step() * scale.paddingInner()) / 2;
    },
  },
  methods: {
    $getOverlayConfig(index) {
      return this.isHorizontal
        ? {
          transform: `translate(0, ${
            this.yScale(this.domain[index]) - this.ghostCorrection
          })`,
          width: this.width,
          height: this.yScale.step(),
        }
        : {
          transform: `translate(${
            this.xScale(this.domain[index]) - this.ghostCorrection
          }, 0)`,
          width: this.xScale.step(),
          height: this.height,
        };
    },
  },
};
