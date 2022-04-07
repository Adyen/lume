<template>
  <svg
    ref="svg"
    class="root"
  >
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
    <g :transform="`translate(${margin}, ${margin})`">
      <bar-group
        v-for="(bar, index) in data"
        :key="`bar-group-${index}`"
        :bar="getBarConfig(bar, index)"
        :overlay="getOverlayConfig(bar, index)"
        :is-hovered="hoveredIndex === index"
        @mouseover="handleMouseover(index, $event)"
        @mouseout="handleMouseout"
      />
    </g>
  </svg>
</template>

<script>
import BarGroup from './bar-group.vue';
import Axis from "../axis.vue";

const defaultHeight = 400;
const defaultPadding = .1;
const fallbackFillColor = 'red';
const defaultMargin = 30;

export default {
  components: {Axis, BarGroup },
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
          .domain([Math.max(...this.data), 0]);
    },
    xScale() {
      return d3
        .scaleBand()
        .rangeRound([0, this.width])
        .domain(this.data.map((value, index) => index))
        .padding(this.padding)
    },
    ghostCorrection() {
      return this.xScale.step() * this.xScale.paddingInner() / 2;
    }
  },
  mounted() {
    this.svg = this.$refs.svg;
    this.width = this.svg.clientWidth - (this.margin * 2);
    this.height = this.svg.clientHeight - (this.margin * 2);
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.width = this.svg.clientWidth;
      this.height = this.svg.clientHeight;
    },
    getBarConfig(bar, index) {
      return {
        transform: `translate(${this.xScale(index)}, ${this.yScale(bar)})`,
        width: this.xScale.bandwidth(),
        height: this.height - this.yScale(bar),
        fill: this.fill || fallbackFillColor
      };
    },
    getOverlayConfig(bar, index) {
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
