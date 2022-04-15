<template>
  <chart-container :margins="margins" @resize="containerSize = $event">
    <axis
        :scale="yScale"
        orientation="left"
        :container-size="containerSize"
    />
    <axis
        :scale="xScale"
        position="bottom"
        orientation="bottom"
        :container-size="containerSize"
    />
    <box-group
      :x-scale="xScale"
      :y-scale="yScale"
      :quantiles="quantiles"
    />
  </chart-container>
</template>

<script>
import Axis from '../core/axis.vue';
import ChartContainer from '../core/chart-container.vue';
import BoxGroup from './box-group.vue';
import { quantile, group, ascending } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';

export default {
  components: { Axis, ChartContainer, BoxGroup },
  props: {
    margins: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      required: true
    },
    groupByLabel: {
      type: String,
      required: true
    },
    valueLabel: {
      type: String,
      required: true
    }
  },
  data: vm => ({
    containerSize: { width: 0, height: 0 }
  }),
  computed: {
    xScale() {
      return scaleBand()
            .range([ 0, this.containerSize.width ])
            .domain(this.domain)
            .paddingInner(1)
            .paddingOuter(.5);
    },
    yScale() {
      return scaleLinear()
          .domain([0.8 * Math.min(...this.values), 1.1 * Math.max(...this.values)])
          .range([this.containerSize.height, 0]);
    },
    values() {
      return this.data.map(ele => ele[this.valueLabel]);
    },
    domain() {
      return [...new Set(this.data.map(ele => ele[this.groupByLabel]))];
    },
    quantiles() {
      const sumstat = [];
      // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
      group(this.data, d => d[this.groupByLabel]).forEach((values, key) => {
        const groupedValues = values.map(g => g[this.valueLabel]);
        const q1 = quantile(groupedValues.sort(ascending),.25)
        const median = quantile(groupedValues.sort(ascending),.5)
        const q3 = quantile(groupedValues.sort(ascending),.75)
        const interQuantileRange = q3 - q1;
        const min = q1 - 1.5 * interQuantileRange;
        const max = q3 + 1.5 * interQuantileRange;
        sumstat.push({key, q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max});
      });
      return sumstat;
    },
  },
  watch: {
    $props: {
      immediate: true,
      handler() {
        this.validateProps();
      }
    }
  },
  methods: {
    validateProps() {
      const labels = this.data.reduce((acc, curr) => [...new Set([...acc, ...Object.keys(curr)])], []);
      if (!labels.includes(this.valueLabel) || !labels.includes(this.groupByLabel)) {
        console.error('Invalid prop');
      }
    }
  }
}
</script>

<style scoped/>