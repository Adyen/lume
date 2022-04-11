<template>
    <path
        class="line-chart__line"
        :class="{
            [`line-chart__line--color-${color}`]: true,
        }"
        :d="pathDefinition"
    />
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            default: '01',
        },
        index: {
            type: Number,
            required: true,
        },
        values: {
            type: Array,
            required: true,
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
        isAnimating: true
    }),
    computed: {
        pathDefinition() {
            return d3.line()
                .x((_, i) => this.xScale(this.index + (i - 1)))
                .y((d) => this.yScale(d))
                (this.values);
        },
    },
    watch: {
        'values': function () { this.isAnimating = true }
    },
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.line-chart__line {
    stroke-width: 2px;
    stroke-linejoin: round;
    stroke-linecap: round;
    fill: none;
     transition: all 0.3s ease;

    @each $color, $map in $chart-colors {
        &--color-#{$color} {
            stroke: nth($map, 1);
        }
    }
}
</style>