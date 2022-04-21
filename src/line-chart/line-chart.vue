<template>
    <div style="height: 100%">
        <chart-container
            :margins="margins"
            @mouseleave.native="hoveredIndex = -1"
            @resize="containerSize = $event"
        >
            <template v-if="showAxes">
                <axis
                    :scale="xScale"
                    orientation="bottom"
                    position="bottom"
                    :container-size="containerSize"
                />
                <axis :scale="yScale" orientation="left" :container-size="containerSize" />
            </template>

            <g class="line-chart__overlay">
                <bar
                    v-for="(_, index) in data[0].values"
                    ref="overlayBars"
                    :key="`overlay-${index}`"
                    :width="xScale.bandwidth()"
                    :height="yScale(minValue)"
                    :transform="`translate(${index * xScale.bandwidth()}, 0)`"
                    :fill-class="hoveredIndex === index ? 'adv-fill-color-overlay' : 'adv-fill-color-transparent'"
                    @mouseover.native="hoveredIndex = index"
                />
            </g>

            <line-group
                v-for="(group, index) in data"
                :key="`line-group-${index}`"
                v-bind="group"
                :x-scale="xScale"
                :y-scale="yScale"
                :hovered-index="hoveredIndex"
                @group-mouseover="hoveredIndex = $event"
            />
        </chart-container>

        <popover
            v-if="isPopoverOpened"
            position="top"
            :opened="isPopoverOpened"
            :target-element="activeOverlayBar"
        >
            <line-popover-text :label="labels[hoveredIndex]" :data="data" :index="hoveredIndex" />
        </popover>
    </div>
</template>

<script>
import Axis from '../core/axis.vue';
import Bar from '../core/bar.vue';
import ChartContainer from '../core/chart-container.vue';
import Popover from '../core/popover.vue';

import LineGroup from './components/line-group.vue';
import LinePopoverText from './components/line-popover-text.vue';

import LineScalesMixin from './mixins/line-scales';
import MarginsMixin from '../mixins/margins';
import OptionsMixin from '../mixins/options';

import config from './config';

export default {
    components: { Axis, Bar, ChartContainer, LineGroup, LinePopoverText, Popover, },
    mixins: [LineScalesMixin, MarginsMixin(config.margins), OptionsMixin()],
    props: {
        data: {
            type: Array,
            required: true,
        },
        labels: {
            type: Array,
            required: true,
        },
    },
    data: () => ({
        containerSize: { width: 0, height: 0 },
        hoveredIndex: -1,
    }),
    computed: {
        activeOverlayBar() {
            return this.$refs.overlayBars?.[this.hoveredIndex]?.$el;
        },
        isPopoverOpened() {
            return this.hoveredIndex >= 0;
        }
    },
}
</script>
