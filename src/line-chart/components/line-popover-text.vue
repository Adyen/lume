<template>
    <div class="line-popover-text">
        <div class="line-popover-text__label">{{ label }}</div>
        <ul class="line-popover-text__list">
            <li v-for="item in data" :key="item.legend" class="line-popover-text__item">
                <span
                    class="line-popover-text__point"
                    :class="`line-popover-text__point--color-${item.color}`"
                ></span>
                {{ item.legend }}
                <strong
                    class="line-popover-text__value"
                >{{ getItemValue(item) }}</strong>
            </li>
        </ul>
    </div>
</template>

<script>
const NO_DATA = "No data";

export default {
    props: {
        label: {
            type: String,
            required: true,
        },
        data: {
            type: Array,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        }
    },
    methods: {
        getItemValue(item) {
            return item.values[this.index] ?? NO_DATA;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../styles/variables";

$item-min-width: 112px;
$item-point-size: 10px;

.line-popover-text {
    &__label {
        font-weight: $adv-text-font-weight-semi-bold;
        margin-bottom: $adv-spacing-8;
    }

    &__list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    &__item {
        display: flex;
        align-items: center;
        min-width: $item-min-width;
    }

    &__point {
        border-radius: 50%;
        margin-right: $adv-spacing-8;
        width: $item-point-size;
        height: $item-point-size;

        @each $color, $map in $chart-colors {
            &--color-#{$color} {
                background-color: nth($map, 1);
            }
        }
    }

    &__value {
        margin-left: auto;
        padding-left: $adv-spacing-16;
    }
}
</style>