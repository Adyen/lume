<template>
    <g class="line-chart__line-group" :class="isHovered && 'line-chart__line-group--hover'">
        <template v-for="(_, index) in values">
            <chart-line
                :key="`line-${index}`"
                :x-scale="xScale"
                :y-scale="yScale"
                :values="getLineValues(index)"
                :index="index"
                :color="color"
                :active="isHovered || isSelected"
                :dashed="isDashed(index)"
                @line-click="isSelected = !isSelected"
                @line-mouseover="isHovered = true"
                @line-mouseout="isHovered = false"
            />
            <line-point
                :key="`point-${index}`"
                :x-scale="xScale"
                :y-scale="yScale"
                :value="getPointValue(index)"
                :index="index"
                :color="color"
                :active="isPointActive(index)"
                @point-click="isSelected = !isSelected"
                @point-mouseover="onPointMouseover(index)"
                @point-mouseout="isHovered = false"
            />
        </template>
    </g>
</template>

<script>
import ChartLine from "./chart-line.vue";
import LinePoint from "./line-point.vue";
import LineNullValuesMixin from "../mixins/line-null-values";

export default {
    components: { ChartLine, LinePoint },
    mixins: [LineNullValuesMixin],
    props: {
        values: {
            type: Array,
            required: true
        },
        color: {
            type: String,
            default: '01',
        },
        legend: {
            type: String,
            default: '',
        },
        hoveredIndex: {
            type: Number,
            default: -1,
        },
        xScale: {
            type: Function,
            required: true,
        },
        yScale: {
            type: Function,
            required: true,
        },
    },
    data: () => ({
        isHovered: false,
        isSelected: false,
    }),
    computed: {
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
    },
    methods: {
        getLineValues(index) {
            // First value
            if (index === 0) return [];

            return [this.computedLineValues[index - 1], this.computedLineValues[index]];
        },
        getPointValue(index) {
            return this.computedLineValues[index];
        },
        isPointActive(index) {
            return this.hoveredIndex === index || this.isHovered || this.isSelected;
        },
        isDashed(index) {
            return !!this.nullIntervals.find(interval => interval.includes(index) || interval.includes(index - 1));
        },
        onPointMouseover(index) {
            this.isHovered = true;
            this.$emit('group-mouseover', index - 1);
        },
    }
};
</script>
