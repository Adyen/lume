<template>
  <div>
    <chart-container :margins="margins" @resize="containerSize = $event">
      <axis
          type="y"
          :scale="yScale"
          :container-size="containerSize"
      />
      <axis
          type="x"
          :scale="xScale"
          :container-size="containerSize"
      />
      <box-group
          v-for="(boxGroup, index) in boxGroups"
          :key="boxGroup.quantile.key"
          :box-group="boxGroup"
          :overlay="$getOverlayConfig(index)"
          :is-hovered="hoveredIndex === index"
          @mouseover="$handleMouseover(boxGroup.quantile, index, $event)"
          @mouseout="$handleMouseout"
      />
    </chart-container>
    <popover
        v-if="popoverConfig.opened"
        v-bind="popoverConfig"
    >
      <div v-for="key in Object.keys(popoverConfig.quantile)">
        <span class="u-font-weight-semi-bold">{{ popoverConfig.quantile[key].label }}</span>: {{ popoverConfig.quantile[key].value }}
      </div>
    </popover>
  </div>
</template>

<script>
import { quantile, group, ascending } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import Axis from '@/core/axis.vue';
import ChartContainer from '@/core/chart-container.vue';
import Popover from '@/core/popover';
import BoxGroup from './box-group.vue';

const boxWidth = 100;

export default {
  components: { Axis, ChartContainer, BoxGroup, Popover },
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
    containerSize: { width: 0, height: 0 },
    hoveredIndex: -1,
    popoverConfig: {
      opened: false,
      position: 'top',
      targetElement: null,
      quantile: null
    }
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
        sumstat.push({key, q1, median, q3, interQuantileRange: interQuantileRange, min: min, max: max});
      });
      return sumstat;
    },
    boxGroups() {
      return this.quantiles.map(quantile => ({
        quantile: {
          q1: { label: '25th percentile', value: quantile.q1.toFixed(2) },
          q2: { label: '75th percentile', value: quantile.q3.toFixed(2) },
          interQuantileRange: { label: 'Inter quantile range', value: quantile.interQuantileRange.toFixed(2) },
          median: { label: 'Median', value: quantile.median.toFixed(2)  },
          min: { label: 'Minimum', value: quantile.min.toFixed(2) },
          max: { label: 'Maximum', value: quantile.max.toFixed(2) }
        },
        verticalLine: {
          x1: this.xScale(quantile.key),
          x2: this.xScale(quantile.key),
          y1: this.yScale(quantile.min),
          y2: this.yScale(quantile.max)
        },
        box: {
          x: this.xScale(quantile.key) - boxWidth/2,
          y: this.yScale(quantile.q3),
          height: this.yScale(quantile.q1) - this.yScale(quantile.q3),
          width: boxWidth
        },
        medianLine: {
          x1: this.xScale(quantile.key) - boxWidth/2,
          x2: this.xScale(quantile.key) + boxWidth/2,
          y1: this.yScale(quantile.median),
          y2: this.yScale(quantile.median)
        }
      }));
    }
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
    },
    $getOverlayConfig(index) {
      return {
        transform: `translate(${this.xScale(this.domain[index])  - boxWidth / 2}, 0)`,
        width: this.xScale.step()  - boxWidth / 4,
        height: this.containerSize.height
      };
    },
    $handleMouseover(quantile, index, event) {
      this.hoveredIndex = index;
      this.popoverConfig.targetElement = event.target;
      this.popoverConfig.opened = true;
      this.popoverConfig.quantile = quantile;
      this.$emit('mouseover', index);
    },
    $handleMouseout() {
      this.hoveredIndex = -1;
      this.popoverConfig.opened = false;
      this.popoverConfig.targetElement = null;
      this.popoverConfig.quantile = null;
          this.$emit('mouseout');
    }
  }
}
</script>

<style scoped/>