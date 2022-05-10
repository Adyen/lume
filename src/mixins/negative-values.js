// @vue/component
export default {
  computed: {
    hasNegativeValues() {
      return this.data.map(dataset => dataset.values || dataset.value).flat().some(v => v < 0);
    },
    negativeHeight() {
      return this.height - this.yScale(0);
    },
    negativeTransform() {
      return this.isHorizontal ? `translate(0, 0)` : `translate(0, ${this.yScale(0)})`;
    },
  },
}
