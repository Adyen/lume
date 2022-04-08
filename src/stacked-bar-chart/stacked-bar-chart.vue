<template>
  <svg
      ref="svg"
      class="root"
  >
    <template v-f="showAxes">
      <axis
          :scale="xScale"
          orientation="bottom"
          :transform.native="`translate(${margin}, ${height + margin})`"
      />
      <axis
          :scale="yScale"
          orientation="left"
          :transform.native="`translate(${margin}, ${margin})`"
      />
    </template>
    <g :transform="barGroupsTransform">
      <bars-group
          v-for="(bars, index) in data"
          :key="`bar-group-${index}`"
          :bars="getBarsConfig(bars, index)"
          :overlay="getOverlayConfig(bars, index)"
          :is-hovered="hoveredIndex === index"
          @mouseover="handleMouseover(index, $event)"
          @mouseout="handleMouseout"
      />
    </g>
  </svg>
</template>

<script>
import BarsGroup from './bars-group.vue';
import Axis from "../core/axis.vue";

const defaultPadding = .1;
const fallbackFillColor = 'red';
const defaultMargin = 30;
const fillColors = ['red', 'green', 'blue', 'brown'];

export default {
  components: { Axis, BarsGroup },
  props: {
    data: {
      type: Array,
      required: true
    },
    padding: {
      type: Number,
      default: defaultPadding
    },
    fill: {
      type: String,
      default: 'red'
    },
    margin: {
      type: Number,
      default: defaultMargin
    },
    showAxes: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    hoveredIndex: -1,
    svg: null,
    width: 0,
    height: 0
  }),
  computed: {
    yScale() {
      return d3
          .scaleLinear()
          .rangeRound([0, this.height])
          .domain([this.maxValue, 0]);
    },
    xScale() {
      return d3
          .scaleBand()
          .rangeRound([0, this.width])
          .domain(this.data.map((value, index) => index))
          .padding(this.padding)
    },
    maxValue() {
      let accumulatedValues = this.data.map(valueSet => valueSet.reduce((acc, curr) => acc + curr, 0));
      return Math.max(...accumulatedValues);
    },
    ghostCorrection() {
      return this.xScale.step() * this.xScale.paddingInner() / 2;
    },
    barGroupsTransform() {
      const margin = this.showAxes ? this.margin : 0;
      return `translate(${margin}, ${margin})`;
    },
  },
  mounted() {
    this.svg = this.$refs.svg;
    this.determineWidthAndHeight();
    window.addEventListener('resize', this.determineWidthAndHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.determineWidthAndHeight);
  },
  methods: {
    determineWidthAndHeight() {
      this.width = this.svg.clientWidth - (this.margin * 2);
      this.height = this.svg.clientHeight - (this.margin * 2);
    },
    getBarsConfig(bars, barsIndex) {
      return bars.reduce((acc, bar, barIndex) => {
        const offsetY = acc.map(({ height }) => height).reduce((sum, curr) => sum + curr, 0);
        return [...acc, {
          transform: `translate(${this.xScale(barsIndex)}, ${this.yScale(bar) - offsetY})`,
          width: this.xScale.bandwidth(),
          height: this.height - this.yScale(bar),
          fill: fillColors[barIndex % fillColors.length]
        }];
      }, []);
    },
    getOverlayConfig(bars, index) {
      return {
        transform: `translate(${this.xScale(index) - this.ghostCorrection}, 0)`,
        width: this.xScale.step(),
        height: this.height
      };
    },
    handleMouseover(index, event) {
      this.hoveredIndex = index;
      this.$emit('mouseover', index);
    },
    handleMouseout() {
      this.hoveredIndex = -1;
      this.$emit('mouseout');
    }
  }
}
</script>

<style>
.root {
  width: 100%;
  height: 100%;
}
</style>