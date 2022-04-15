import Axis from "../core/axis.vue";
import Popover from '../core/popover.vue';

const defaultPadding = .33;
const defaultMargin = 30;
const pad = value => !value && value !== 0 ? 0 : value

// @vue/component
export default {
    components: { Axis, Popover },
    props: {
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
        margin: {
            type: Number,
            default: defaultMargin
        },
        showAxes: {
            type: Boolean,
            default: true
        },
        barsConfig: {
            type: Object,
            default: () => ({})
        }
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
        yScale() {
            return d3
                .scaleLinear()
                .rangeRound([0, this.height])
                .domain([this.maxValue, this.minValue]);
        },
        xScale() {
            return d3
                .scaleBand()
                .rangeRound([0, this.width])
                .paddingInner(this.padding)
                .paddingOuter(this.padding / 2)
                .domain(this.domain);
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
            const accumulatedValues = this.paddedDataAsArray.map(valueSet =>
                valueSet.length > 0 ? valueSet.reduce((acc, curr) => acc + curr, 0) : valueSet);

            return Math.max(...accumulatedValues);
        },
        minValue() {
            const accumulatedValues = this.paddedDataAsArray.map(valueSet =>
                valueSet.length > 0 ? valueSet.filter(value => value < 0).reduce((acc, curr) => acc + curr, 0) : valueSet);

            return Math.min(0, ...accumulatedValues);
        },
        hasNegativeValues() {
            return this.paddedDataAsArray
                .flat()
                .some(value => value < 0);
        },
        barGroupsTransform() {
            return `translate(${this.computedMargin}, ${this.computedMargin})`;
        },
        negativeTransform() {
            return `translate(${this.computedMargin}, ${this.computedMargin + this.yScale(0)})`
        },
        computedMargin() {
            return this.showAxes ? this.margin : 0;
        },
        negativeHeight() {
            return this.height - this.yScale(0);
        },
        ghostCorrection() {
            return this.xScale.step() * this.xScale.paddingInner() / 2;
        },
    },
    methods: {
        $determineWidthAndHeight({ width, height }) {
            this.width = width - (this.margin * 2);
            this.height = height - (this.margin * 2);
        },
        $getOverlayConfig(bars, index) {
            return {
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
}
