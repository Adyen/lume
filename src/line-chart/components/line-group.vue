<template>
    <g class="line-chart__line-group" :class="isHovered && 'line-chart__line-group--hover'">
        <chart-line
            v-for="(value, index) in values"
            :key="`line-${index}`"
            :x-scale="xScale"
            :y-scale="yScale"
            :values="getLineValues(index)"
            :index="index"
            :color="color"
        />
    </g>
</template>

<script>
import ChartLine from "./chart-line.vue";

export default {
    components: { ChartLine },
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
        }
    }
};
</script>

<style>
</style>