<template>
  <g
    ref="root"
    class="axis"
    :data-type="computedType"
    :transform="computedTransform"
  >
    <text
      v-if="label"
      ref="label"
      v-bind="labelPosition"
      class="axis__label"
    >
      {{ label }}
    </text>
  </g>
</template>

<script>
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { select } from 'd3-selection';
import { format } from 'd3-format';

import OptionsMixin from '@/mixins/options';

import { options } from './defaults';

const POSITIONS = ['left', 'top', 'right', 'bottom'];

const AXIS_MAP = {
  left: axisLeft,
  right: axisRight,
  top: axisTop,
  bottom: axisBottom,
};

const TYPES = {
  x: 'bottom',
  y: 'left',
};

const LABEL_HEIGHT = 14; // 14px
const LABEL_PADDING = 12; // 12px

const LABEL_MARGIN = {
  y: LABEL_HEIGHT + LABEL_PADDING,
};

export default {
  mixins: [OptionsMixin(options)],
  props: {
    scale: {
      type: Function,
      required: true,
    },
    type: {
      type: String,
      default: null,
      validator: (value) => value in TYPES,
    },
    position: {
      type: String,
      default: null,
      validator: (value) => POSITIONS.includes(value),
    },
    label: {
      type: String,
      default: null,
    },
    containerSize: {
      type: Object,
      default: () => ({ width: 0, height: 0 }),
    },
    transform: {
      type: String,
      default: null,
    },
  },
  computed: {
    computedPosition() {
      return this.type ? TYPES[this.type] : this.position;
    },
    computedType() {
      return (
        this.type ||
        (this.computedPosition === 'left' || this.computedPosition === 'right'
          ? 'y'
          : 'x')
      );
    },
    axis() {
      const axis = AXIS_MAP[this.computedPosition](this.scale);
      return axis
        .ticks(this.allOptions.tickCount)
        .tickSize(this.tickSize) // Used to draw grid lines
        .tickPadding(this.allOptions.tickPadding)
        .tickFormat(this.tickFormat);
    },
    computedTransform() {
      if (this.transform) return this.transform;
      return `translate(${this.translateX}, ${this.translateY})`;
    },
    tickSize() {
      if (this.allOptions.gridLines) {
        const { width, height } = this.containerSize;
        return this.computedType === 'y' ? width : height;
      }
      return 0;
    },
    tickFormat() {
      const { showTicks, tickFormat } = this.allOptions;

      // Hides ticks without hiding `gridLines`
      if (showTicks === false) return '';

      if (typeof tickFormat === 'string') {
        const formatter = format(tickFormat);
        return formatter;
      }

      if (typeof tickFormat === 'function') {
        return tickFormat;
      }

      return null;
    },
    translateX() {
      const xValue = this.tickSize || this.containerSize.width || 0;

      // For axes rendering grid lines
      if (this.tickSize) return this.computedPosition === 'left' ? xValue : 0;

      if (this.computedPosition === 'right') return xValue;

      return 0;
    },
    translateY() {
      const yValue = this.tickSize || this.containerSize.height || 0;

      // For axes rendering grid lines
      if (this.tickSize) return this.computedPosition === 'top' ? yValue : 0;

      if (this.computedPosition === 'bottom') return yValue;

      return 0;
    },
    labelPosition() {
      return {
        x: '-100%',
        y: -LABEL_MARGIN[this.computedType],
      };
    },
  },
  watch: {
    scale: 'applyAxis',
    allOptions: 'applyAxis',
  },
  mounted() {
    this.root = select(this.$refs.root);
    this.applyAxis();
  },
  methods: {
    applyAxis() {
      this.root
        // NOTE: d3.js v6.6.2 can't apply transition, so suspending it for now.
        // .transition()
        ?.call(this.axis);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

$axis-label-color: $adv-color-grey-50;
$axis-text-color: $adv-color-grey-30;
$axis-line-color: $adv-color-grey-20;

$axis-label-font-size: 14px;
$axis-text-font-size: 10px;

.axis ::v-deep {
  .domain {
    opacity: 0;
  }

  text {
    fill: $axis-text-color;
    font-size: $axis-text-font-size;
  }

  .axis__label {
    fill: $axis-label-color;
    font-size: $axis-label-font-size;
    text-anchor: start;
  }

  line {
    fill: none;
    stroke: $axis-line-color;
    shape-rendering: crispEdges;
  }
}
</style>
