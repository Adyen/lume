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
                :active="isHovered"
                @line-mouseover="isHovered = true"
                @line-mouseout="isHovered = false"
            />
            <line-point
                :x-scale="xScale"
                :y-scale="yScale"
                :value="getPointValue(index)"
                :index="index"
                :color="color"
                :active="isHovered"
                @point-mouseover="isHovered = true"
                @point-mouseout="isHovered = false"
            />
        </template>
    </g>
</template>

<script>
import ChartLine from "./chart-line.vue";
import LinePoint from "./line-point.vue";

export default {
    components: { ChartLine, LinePoint },
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
        isHovered: false
    }),
    methods: {
        getLineValues(index) {
            if (index === 0) return [];
            return [this.values[index - 1], this.values[index]];
        },
        getPointValue(index) {
            return this.values[index];
        }
    }
};
</script>

<style>
</style>