import Axis from "../core/axis.vue";
import Popover from '../core/popover';
import { scaleBand, scaleLinear } from 'd3-scale';
import { defaultMargins, orientations } from '../constants.js'
const defaultPadding = .33;
const pad = value => !value && value !== 0 ? 0 : value;

export default function barMixinFactory(orientation = orientations.vertical, isStacked = false) {
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
            yScale() {
                const scale = this.isHorizontal ?
                    scaleBand()
                        .paddingInner(this.padding)
                        .paddingOuter(this.padding / 2)
                        .domain(this.domain) :
                    scaleLinear()
                        .domain([this.maxValue, this.minValue])
                        .nice(10);

                return scale
                    .rangeRound([0, this.height])
            },
            xScale() {
                const scale = this.isHorizontal ?
                    scaleLinear()
                        .domain([this.minValue, this.maxValue])
                        .nice() :
                    scaleBand()
                        .paddingInner(this.padding)
                        .paddingOuter(this.padding / 2)
                        .domain(this.domain);

                return scale
                    .rangeRound([0, this.width]);
            },
            xAxisOptions() {
                return {
                    gridLines: true
                }
            },
            paddedData() {
                return this.data.map(record => ({
                    ...record,
                    ...('value' in record ? { value: pad(record.value) } : {}),
                    ...('values' in record ? { values: record.values.map(pad) } : {})
                }))
            },
            paddedDataAsArray() {
                return this.paddedData.map(record => 'value' in record ? record.value : record.values);
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
            hasNegativeValues() {
                return this.paddedDataAsArray
                    .flat()
                    .some(value => value < 0);
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

