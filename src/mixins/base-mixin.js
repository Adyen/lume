import Axis from "../core/axis.vue";
import Popover from '../core/popover';
import { defaultMargins, orientations } from '../constants.js'
const defaultPadding = .33;

export default function BaseMixinFactory(orientation = orientations.vertical, isStacked = false) {
  // @vue/component
  return {
    components: { Axis, Popover },
    props: {
      startOnZero: {
        type: Boolean,
        default: true, // Guidelines state that baseline should be 0
      },
      data: {
        type: Array,
        required: true
      },
      labels: {
        type: Array,
        default: null
      },
      padding: {
        type: Number,
        default: defaultPadding
      },
      showAxes: {
        type: Boolean,
        default: true
      },
      barsConfig: {
        type: Object,
        default: () => ({})
      },
      margins: {
        type: Object,
        default: () => ({ ...defaultMargins })
      },
    },
    data: () => ({
      hoveredIndex: -1,
      svg: null,
      width: 0,
      height: 0,
      popoverConfig: {
        opened: false,
        position: 'top',
        targetElement: null
      },
    }),
    computed: {
      isHorizontal() {
        return orientation === orientations.horizontal;
      },
      xAxisOptions() {
        return {
          gridLines: true
        }
      },
      domain() {
        return this.labels || this.data.map((value, index) => index);
      },
      maxValue() {
        // Make sure we can handle both single values and arrays of values
        const accumulatedValues = this.paddedDataAsArray.map(valueSet => {
          if (valueSet.length > 0) {
            return isStacked ? valueSet.reduce((acc, curr) => acc + curr, 0) : Math.max(...valueSet)
          }
          return valueSet;
        });

        return Math.max(...accumulatedValues);
      },
      minValue() {
        const accumulatedValues = this.paddedDataAsArray.map(valueSet => {
          if (valueSet.length > 0) {
            return isStacked ? valueSet.filter(value => value < 0).reduce((acc, curr) => acc + curr, 0) : Math.min(...valueSet)
          }
          return valueSet;
        });

        return Math.min(...(this.startOnZero ? [0] : []), ...accumulatedValues);
      },
      negativeTransform() {
        return this.isHorizontal ? `translate(0, 0)` : `translate(0, ${this.yScale(0)})`;
      },
      negativeHeight() {
        return this.height - this.yScale(0);
      },
      ghostCorrection() {
        const scale = this.isHorizontal ? this.yScale : this.xScale;
        return scale.step() * scale.paddingInner() / 2;
      },
      containerSize() {
        return { width: this.width, height: this.height };
      }
    },
    methods: {
      $setHeight(height) {
        this.height = height;
      },
      $determineWidthAndHeight({ width, height }) {
        this.width = width;
        this.height = height;
      },
      $getOverlayConfig(bars, index) {
        return this.isHorizontal ? {
          transform: `translate(0, ${this.yScale(this.domain[index]) - this.ghostCorrection})`,
          width: this.width,
          height: this.yScale.step()
        } : {
          transform: `translate(${this.xScale(this.domain[index]) - this.ghostCorrection}, 0)`,
          width: this.xScale.step(),
          height: this.height
        };
      },
      $handleMouseover(index, event) {
        this.hoveredIndex = index;
        this.popoverConfig.targetElement = event.target;
        this.popoverConfig.opened = true;
        this.$emit('mouseover', index);
      },
      $handleMouseout() {
        this.hoveredIndex = -1;
        this.popoverConfig.opened = false;
        this.popoverConfig.targetElement = null;
        this.$emit('mouseout');
      }
    }
  };
}

