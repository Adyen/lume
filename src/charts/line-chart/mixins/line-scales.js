import { scaleBand, scaleLinear } from 'd3-scale';

// @vue/component
export default function LineScalesMixin(defaultStartOnZero = true) {
  return {
    props: {
      startOnZero: {
        type: Boolean,
        default: defaultStartOnZero, // Guidelines state that baseline should be 0
      }
    },
    computed: {
      /**
       * Internal value of `startOnZero`.
       * @private
       * @returns {Boolean} If y axis should start on zero or not.
       */
      __computedStartOnZero() {
        // Comes from `@/mixins/negative-values`
        // If has negative values, this has to be `false`.
        if (this.hasNegativeValues) return false;
        return this.startOnZero;
      },
      /**
       * @returns {Number} The maximum value of the dataset.
       */
      maxValue() {
        const maxValues = this.data.map(d => Math.max(...d.values));
        return Math.max(...maxValues);
      },
      /**
       * @returns {Number} The minimum value of the dataset.
       */
      minValue() {
        if (this.__computedStartOnZero) return 0;
        const minValues = this.data.map(d => Math.min(...d.values.filter(e => e !== null)));
        return Math.min(...minValues);
      },
      /**
       * @returns {Function} The x axis scale (band scale) for line charts.
       */
      xScale() {
        return scaleBand()
          .range([0, this.containerSize.width])
          .domain(this.labels.map((_, index) => index))
      },
      /**
       * @returns {Function} The y axis scale (linear scale) for line charts.
       */
      yScale() {
        return scaleLinear()
          .rangeRound([0, this.containerSize.height])
          .domain([this.maxValue, this.minValue])
      },
    }
  }
}
