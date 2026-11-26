<template>
    <g>
        <text
            v-for="(value, index) in internalData[0].values"
            v-bind="getEmojiPosition(value.value, index)"
            :key="`emoji-${index}`"
            class="emoji"
            :class="hoveredIndex === index && 'emoji--hovered'"
        >
            {{ EMOJIS[index] }}
        </text>
    </g>
</template>

<script lang="ts">
    import { defineComponent, type PropType, toRefs } from 'vue';
    import { type ScaleBand, type ScaleLinear } from 'd3';

    import { useBase } from '@/composables/base';

    import type { Data } from '@/types/dataset';

    const EMOJIS = ['🚓', '🍟', '🍺', '🎱', '🐻', '🐶', '💈'];

    export default defineComponent({
        props: {
            data: {
                type: Array as PropType<Data>,
                required: true,
            },
            xScale: {
                type: Function as PropType<ScaleBand<number | string>>,
                required: true,
            },
            yScale: {
                type: Function as PropType<ScaleLinear<number, number>>,
                required: true,
            },
            hoveredIndex: {
                type: Number,
                default: -1,
            },
        },
        setup(props) {
            const { data, xScale, yScale } = toRefs(props);

            const { internalData } = useBase(data);

            function getEmojiPosition(value: number, index: number) {
                return {
                    x: xScale.value(xScale.value.domain()[index]) + xScale.value.bandwidth() / 2,
                    y: yScale.value(value),
                };
            }

            return {
                EMOJIS,
                getEmojiPosition,
                internalData,
            };
        },
    });
</script>

<style lang="scss" scoped>
    .emoji {
        cursor: default;
        dominant-baseline: middle;
        font-size: 32px;
        transform: translateX(-18px);
        transition: all 0.1s ease-out;

        &--hovered {
            font-size: 44px;
            transform: translateX(-23px);
        }
    }
</style>
