<template>
  <svg
    ref="svg"
    class="root"
  >
    <bar-group
      v-for="(bar, index) in data"
      :key="`bar-group-${index}`"
      :bar="getBarConfig(bar, index)"
      :overlay="getOverlayConfig(bar, index)"
      :is-hovered="hoveredIndex === index"
      @mouseover="handleMouseover(index, $event)"
      @mouseout="handleMouseout"
    />
  </svg>
</template>

<script>
import BarGroup from './bar-group.vue';

const defaultHeight = 400;
const defaultPadding = .1;
const fallbackFillColor = 'red';

export default {
  components: { BarGroup },
  props: {
    data: {
      type: Array,
      required: true
    },
    padding: {
      type: Number,
      default: defaultPadding
    },
    height: {
      type: Number,
      default: defaultHeight
    },
    fill: {
      type: String,
      default: 'red'
    }
  },
  data: () => ({
    hoveredIndex: -1,
    svg: null,
    width: 0
  }),
  computed: {
    yScale() {
      return d3
          .scaleLinear()
          .rangeRound([0, this.height])
          .domain([0, Math.max(...this.data)]);
    },
    xScale() {
      return d3
        .scaleBand()
        .rangeRound([0, this.width])
        .domain(this.data.map((value, index) => index))
        .padding(this.padding);
    },
    ghostCorrection() {
      return this.xScale.step() * this.xScale.paddingInner() / 2;
    }
  },
  mounted() {
    this.svg = this.$refs.svg;
    this.width = this.svg.clientWidth;
    this.height = this.svg.clientHeight;
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
        transform: `translate(${this.xScale(index)}, ${this.height - this.yScale(bar)})`,
        width: this.xScale.bandwidth(),
        height: this.yScale(bar),
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
      console.log(event.target.parentNode);
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
