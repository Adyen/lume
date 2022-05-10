import { scaleLinear } from 'd3-scale';

// @vue/component
export default {
  computed: {
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
      const minValues = this.data.map(d => Math.min(...d.values.filter(e => e !== null)));
      return Math.min(...minValues);
    },
    /**
     * @returns {Function} The x axis scale (band scale) for sparkline charts.
     */
    xScale() {
      return scaleLinear()
        .range([0, this.containerSize.width])
        .domain([0, this.values.length - 1])
    },
    /**
     * @returns {Function} The y axis scale (linear scale) for sparkline charts.
     */
    yScale() {
      return scaleLinear()
        .rangeRound([0, this.containerSize.height])
        .domain([this.maxValue, this.minValue])
    },
  }
}
