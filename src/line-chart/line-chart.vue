<template>
    <div style="height: 100%">
        <chart-container
            :margins="margins"
            @mouseleave.native="hoveredIndex = -1"
            @resize="containerSize = $event"
        >
            <template v-if="allOptions.showAxes">
                <axis
                    type="x"
                    v-bind:options="allOptions.xAxisOptions"
                    :scale="labelScale"
                    :container-size="containerSize"
                />
                <axis
                    type="y"
                    v-bind:options="allOptions.yAxisOptions"
                    :scale="yScale"
                    :container-size="containerSize"
                />
            </template>

            <g class="line-chart__overlay">
                <bar
                    v-for="(_, index) in data[0].values"
                    ref="overlayBars"
                    :key="`overlay-${index}`"
                    :width="xScale.bandwidth()"
                    :height="yScale(minValue)"
                    :transform="getLineTranslation(index)"
                    :fill-class="hoveredIndex === index ? 'adv-fill-color-overlay' : 'adv-fill-color-transparent'"
                    :animate="false"
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
import Axis from '@/core/axis.vue';
import Bar from '@/core/bar.vue';
import ChartContainer from '@/core/chart-container.vue';
import Popover from '@/core/popover.vue';

import LineGroup from './components/line-group.vue';
import LinePopoverText from './components/line-popover-text.vue';

import LineScalesMixin from './mixins/line-scales';
import MarginsMixin from '@/mixins/margins';
import OptionsMixin from '@/mixins/options';

import config from './config';

export default {
    components: { Axis, Bar, ChartContainer, LineGroup, LinePopoverText, Popover, },
    mixins: [LineScalesMixin, MarginsMixin(config.margins), OptionsMixin({
        showAxes: true,
        xAxisOptions: {},
        yAxisOptions: {},
    })],
    data: () => ({
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
    methods: {
      getLineTranslation(index) {
        return `translate(${this.xScale(index)}, 0)`;
      }
  }
}
</script>
