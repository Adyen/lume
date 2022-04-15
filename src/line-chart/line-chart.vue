<template>
    <chart-container :margins="margins" @resize="containerSize = $event">
        <template v-if="showAxes">
            <axis
                :scale="xScale"
                orientation="bottom"
                position="bottom"
                :container-size="containerSize"
            />
            <axis :scale="yScale" orientation="left" :container-size="containerSize" />
        </template>

        <line-group
            v-for="(group, index) in data"
            :key="`line-group-${index}`"
            v-bind="group"
            :x-scale="xScale"
            :y-scale="yScale"
        />
    </chart-container>
</template>

<script>
import Axis from '../core/axis.vue';
import ChartContainer from '../core/chart-container.vue';
import LineGroup from './components/line-group.vue';

import LineScalesMixin from './mixins/line-scales';
import MarginsMixin from '../mixins/margins';
import OptionsMixin from '../mixins/options';

import config from './config';

export default {
    components: { Axis, ChartContainer, LineGroup },
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
}
</script>
