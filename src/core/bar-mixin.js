import Axis from "../core/axis.vue";

const defaultPadding = .1;
const defaultMargin = 30;

// @vue/component
export default {
    components: { Axis },
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
            console.log(this.accumulatedValues);
            return d3
                .scaleLinear()
                .rangeRound([0, this.height])
                .domain([this.maxValue, this.minValue]);
        },
        xScale() {
            return d3
                .scaleBand()
                .rangeRound([0, this.width])
                .domain(this.domain)
                .padding(this.padding)
        },
        domain() {
          return this.labels || this.data.map((value, index) => index);
        },
        maxValue() {
            // Make sure we can handle both single values and arrays of values
            const accumulatedValues = this.data.map(valueSet => valueSet.length > 0 ? valueSet.reduce((acc, curr) => acc + curr, 0) : valueSet);
            return Math.max(...accumulatedValues);
        },
        minValue() {
            const accumulatedValues = this.data.map(valueSet => valueSet.length > 0 ? valueSet.filter(value => value < 0).reduce((acc, curr) => acc + curr, 0) : valueSet);
            return Math.min(0, ...accumulatedValues);
        },
        hasNegativeValues() {
            return this.data.flat().some(value => value < 0);
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
    mounted() {
        this.svg = this.$refs.svg;
        this.$determineWidthAndHeight();
        window.addEventListener('resize', this.$determineWidthAndHeight);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.$determineWidthAndHeight);
    },
    methods: {
        $determineWidthAndHeight() {
            this.width = this.svg.clientWidth - (this.margin * 2);
            this.height = this.svg.clientHeight - (this.margin * 2);
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
            this.$emit('mouseover', index);
        },
        $handleMouseout() {
            this.hoveredIndex = -1;
            this.$emit('mouseout');
        }
    }
}