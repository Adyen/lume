<template>
  <circle
    class="line-chart__point"
    :class="`line-chart__point--color-${color}`"
    :r="active ? radius : 0"
    :cx="cx"
    :cy="cy"
    @click="$emit('point-click', index)"
    @mouseover="$emit('point-mouseover', index)"
    @mouseout="$emit('point-mouseout')"
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
        domain() { return this.xScale.domain(); },
        cx() {
            return this.xScale(this.domain[this.index]) + this.xAxisOffset;
        },
        cy() {
            return this.yScale(this.value);
        },
        xAxisOffset() {
            return this.xScale.bandwidth() / 2;
        }
    },
};
</script>

<style lang="scss" scoped>
@use "~@/styles/variables" as *;

.line-chart__point {
    transition: all $chart-transition-time ease;

    @each $color, $map in $chart-colors {
        &--color-#{$color} {
            fill: nth($map, 1);
        }
    }
}
</style>