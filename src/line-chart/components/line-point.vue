<template>
    <circle
        class="line-chart__circle"
        :class="{
            [`line-chart__circle--color-${color}`]: true,
            'line-chart__circle--active': isActive,
        }"
        :r="radius"
        :cx="cx"
        :cy="cy"
    />
</template>

<script>
export default {
    props: {
        color: {
            type: String,
            default: '01',
        },
        radius: {
            type: Number,
            default: 4,
        },
        value: {
            type: Number,
            required: true,
        },
        index: {
            type: Number,
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
        isActive: false
    }),
    computed: {
        cx() {
            return this.xScale(this.index);
        },
        cy() {
            return this.yScale(this.value);
        }
    },
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.line-chart__circle {
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
        &--color-#{$color} {
            opacity: 0;
            fill: nth($map, 1);
        }
    }

    &--active {
        opacity: 1;
    }
}
</style>