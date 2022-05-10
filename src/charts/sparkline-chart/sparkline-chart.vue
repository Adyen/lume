<template>
  <div class="sparkline-chart u-width-full u-height-full">
    <chart-container
      :margins="computedMargin"
      @mouseleave.native="hoveredIndex = -1"
      @resize="$determineWidthAndHeight"
    >
      <!-- Area -->
      <path
        v-if="allOptions.showArea"
        :class="['sparkline-chart__area', `sparkline-chart__area--color-${areaColor || color}`]"
        :d="areaPathDefinition"
      />

      <!-- Negative area -->
      <bar
        v-if="hasNegativeValues"
        :height="negativeHeight"
        :width="width"
        :transform="negativeTransform"
        fill-class="adv-fill-color-negative-values"
      />

      <!-- Line -->
      <path
        v-for="(d, i) in values"
        :key="i"
        :class="[
          'sparkline-chart__line',
          `sparkline-chart__line--color-${color}`,
          ...isDashed(i) ? ['sparkline-chart__line--dashed'] : []
        ]"
        :stroke-dasharray="(d => (d == null ? '1.5%' : null))(d)"
        :d="linePathDefinition(i)"
      />
    </chart-container>
  </div>
</template>

<script>
import { line, area } from 'd3-shape';

import ChartContainer from '@/core/chart-container.vue';
import Bar from '@/core/bar.vue';

import BaseMixinFactory from '@/mixins/base-mixin';
import OptionsMixin from '@/mixins/options';
import NegativeValuesMixin from '@/mixins/negative-values';
import LineNullValuesMixin from "@/mixins/line-null-values";
import SparklineScalesMixin from './mixins/sparkline-scales';

import config from './config';

export default {
  components: { Bar, ChartContainer },
  mixins: [
    BaseMixinFactory(),
    SparklineScalesMixin,
    LineNullValuesMixin,
    NegativeValuesMixin,
    OptionsMixin({
      showArea: true,
    }),
  ],
  data: () => ({
    hoveredIndex: -1,
  }),
  computed: {
    color() {
      return this.data[0].color;
    },
    areaColor() {
      return this.data[0].areaColor || this.data[0].color;
    },
    computedMargin() {
      return {
        ...this.margins,
        ...config.margins,
      }
    },
    values() {
      return this.data[0].values;
    },
    computedLineValues() {
      return this.values.map((value, index) => {
        const nullInterval = this.nullIntervals.find(interval => interval.includes(index));
        if (nullInterval) {
          let start = this.values[nullInterval[0] - 1];
          let end = this.values[nullInterval[nullInterval.length - 1] + 1];

          // If first/last value is `null`, use the first/last non-null value
          if (start == null) start = end;
          if (end == null) end = start;

          return this.getMidValue(start, end, nullInterval.length, nullInterval.indexOf(index));
        }
        return value;
      });
    },
    areaPathDefinition() {
      return (area()
        .x((_, i) => this.xScale(i))
        .y0(this.yScale(0))
        .y1((d) => this.yScale(d)))(this.computedLineValues);
    }
  },
  methods: {
    getLineValues(index) {
      // First value
      if (index === 0) return [];
      return [this.computedLineValues[index - 1], this.computedLineValues[index]];
    },
    linePathDefinition(index) {
      return line()
        .x((_, i) => this.xScale((index + i) - 1))
        .y((d) => this.yScale(d))(this.getLineValues(index));
    },
  }
}
</script>

<style lang="scss" scoped>
@use "~@/styles/variables" as *;

$line-stroke-width: 2px;
$line-stroke-hover-width: 4px;
$ghost-line-stroke-width: 8px;

.sparkline-chart {
  &__area {
    fill: $adv-color-grey-20;
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
      &--color-#{$color} {
        fill: nth($map, 3);
      }
    }
  }

  &__line {
    stroke-width: $line-stroke-width;
    stroke-linejoin: round;
    stroke-linecap: round;
    fill: none;
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
      &--color-#{$color} {
        stroke: nth($map, 1);
      }
    }

    &--dashed {
      stroke-dasharray: 2%;
    }
  }
}
</style>