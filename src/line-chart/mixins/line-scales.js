import { scaleBand, scaleLinear } from 'd3-scale';

// @vue/component
export default {
    props: {
        startOnZero: {
            type: Boolean,
            default: true, // Guidelines state that baseline should be 0
        }
    },
    computed: {
        maxValue() {
            const maxValues = this.data.map(d => Math.max(...d.values));
            return Math.max(...maxValues);
        },
        minValue() {
            if (this.startOnZero) return 0;
            const minValues = this.data.map(d => Math.min(...d.values.filter(e => e !== null)));
            return Math.min(...minValues);
        },
        xScale() {
            return scaleBand()
                .rangeRound([0, this.containerSize.width])
                .padding(0)
                .domain(this.labels.map((_, index) => index))
        },
        yScale() {
            return scaleLinear()
                .rangeRound([0, this.containerSize.height])
                .domain([this.maxValue, this.minValue])
        },
    }
}
