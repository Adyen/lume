<template>
  <g ref="root" class="axis" :transform.native="this.computedTransform"></g>
</template>

<script>
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { select } from 'd3-selection';

import OptionsMixin from '@/mixins/options';

const POSITIONS = ['left', 'top', 'right', 'bottom'];

const AXIS_MAP = {
  left: axisLeft,
  right: axisRight,
  top: axisTop,
  bottom: axisBottom,
}

const TYPES = {
  x: 'bottom',
  y: 'left',
};

const DEFAULTS = {
  TICK_PADDING: 8
};

export default {
  mixins: [OptionsMixin({
    /**
     * Displays a line for each tick. If not specified but axis type is `y`, will show grid lines.
     * @type {Boolean}
     */
    gridLines: false,
    //
    //// Tick settings
    //
    /** 
     * Amount of ticks to display in the axis.
     * @type {Number}
     */
    tickCount: null,
    /**
     * Formatting string/function for the tick label. -- currently UNUSED
     * @type {(String|Function)}
     */
    tickFormat: null,
    /**
     * Space between the tick label and the axis line.
     * @type {Number}
     */
    tickPadding: DEFAULTS.TICK_PADDING,
  })],
  props: {
    scale: {
      type: Function,
      required: true
    },
    type: {
      type: String,
      default: null,
      validator: value => value in TYPES
    },
    position: {
      type: String,
      default: null,
      validator: value => POSITIONS.includes(value)
    },
    containerSize: {
      type: Object,
      default: () => ({ width: 0, height: 0 })
    },
    transform: {
      type: String,
      default: null
    }
  },
  watch: {
    'scale': 'applyAxis'
  },
  computed: {
    computedPosition() {
      return this.type ? TYPES[this.type] : this.position;
    },
    computedType() {
      return this.type || (this.computedPosition === 'left' || this.computedPosition === 'right' ? 'y' : 'x');
    },
    axis() {
      const axis = AXIS_MAP[this.computedPosition](this.scale);
      return axis
        .ticks(this.allOptions.tickCount)
        .tickSize(this.tickSize) // Used to draw grid lines
        .tickPadding(this.allOptions.tickPadding);
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
    }
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
  }
}
</script>

<style lang="scss" scoped>
@use "~@/styles/variables" as *;

$axis-text-color: $adv-color-grey-30;
$axis-line-color: $adv-color-grey-20;

$axis-text-font-size: 10px;

.axis ::v-deep {
  .domain {
    opacity: 0;
  }

  text {
    fill: $axis-text-color;
    font-size: $axis-text-font-size;
  }

  line {
    fill: none;
    stroke: $axis-line-color;
    shape-rendering: crispEdges;
  }
}
</style>