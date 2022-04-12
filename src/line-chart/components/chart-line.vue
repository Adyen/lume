<template>
    <g>
        <path
            class="line-chart__line"
            :class="{
                [`line-chart__line--color-${color}`]: true,
                ['line-chart__line--active']: active,
            }"
            :d="pathDefinition"
        />
        <!-- Ghost path to facilitate hover functions -->
        <path
            class="line-chart__ghost-line"
            :d="pathDefinition"
            @mouseover="$emit('line-mouseover', index)"
            @mouseout="$emit('line-mouseout')"
        />
    </g>
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
        active: {
            type: Boolean,
            default: false,
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
    data: () => ({}),
    computed: {
        pathDefinition() {
            return d3.line()
                .x((_, i) => this.xScale(this.index + (i - 1)))
                .y((d) => this.yScale(d))
                (this.values);
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

$line-stroke-width: 2px;
$line-stroke-hover-width: 4px;
$ghost-line-stroke-width: 8px;

.line-chart__line {
    stroke-width: $line-stroke-width;
    stroke-linejoin: round;
    stroke-linecap: round;
    fill: none;
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
        &--color-#{$color} {
            stroke: nth($map, 1);
        }
    }

    &--active {
        stroke-width: $line-stroke-hover-width;
    }
}

.line-chart__ghost-line {
    stroke-width: $ghost-line-stroke-width;
    stroke-linejoin: round;
    stroke-linecap: round;
    fill: none;
    stroke: rgba(
        0,
        0,
        0,
        0
    ); /* Needs a stroke value to be able to act, set with 0 opacity to hide it */
    cursor: pointer;
}
</style>