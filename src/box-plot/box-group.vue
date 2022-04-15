<template>
  <g>
    <line
        v-for="line in verticalLines"
        class="box-plot__line"
        v-bind="line"
    />
    <rect
        v-for="box in boxes"
        class="box-plot__box"
        v-bind="box"
    />
    <line
        v-for="line in medianLines"
        class="box-plot__median"
        v-bind="line"
    />
  </g>
</template>

<script>

const boxWidth = 100;

export default {
  props: {
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      required: true
    },
    quantiles: {
      type: Array,
      required: true
    }
  },
  computed: {
    verticalLines() {
      return this.quantiles.map(quantile => ({
        x1: this.xScale(quantile.key),
        x2: this.xScale(quantile.key),
        y1: this.yScale(quantile.min),
        y2: this.yScale(quantile.max)
      }));
    },
    boxes() {
      return this.quantiles.map(quantile => ({
        x: this.xScale(quantile.key) - boxWidth/2,
        y: this.yScale(quantile.q3),
        height: this.yScale(quantile.q1) - this.yScale(quantile.q3),
        width: boxWidth
      }));
    },
    medianLines() {
      return this.quantiles.map(quantile => ({
        x1: this.xScale(quantile.key) - boxWidth/2,
        x2: this.xScale(quantile.key) + boxWidth/2,
        y1: this.yScale(quantile.median),
        y2: this.yScale(quantile.median)
      }))
    }
  }
}
</script>

<style scoped lang="scss">
@import "../styles/variables.scss";

.box-plot {
  &__line {
    stroke: $adl-color-data-viz-grey-darker;
    width: 40px;
  }
  &__box {
    fill: $adl-color-data-viz-yellow;
    stroke: $adl-color-data-viz-grey-darker;
  }
  &__median {
    stroke: $adl-color-data-viz-grey-darker;
    width: 80px;
  }
}
</style>