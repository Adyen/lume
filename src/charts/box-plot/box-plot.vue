<template>
  <div class="u-width-full u-height-full">
    <chart-container
      :margins="computedConfig.margins"
      @resize="updateSize"
    >
      <template v-if="allOptions.showAxes && xScale && yScale">
        <axis
          type="x"
          :options="allOptions.xAxisOptions"
          :scale="xScale"
          :container-size="containerSize"
        />
        <axis
          type="y"
          :options="allOptions.yAxisOptions"
          :scale="yScale"
          :label="yAxisLabel"
          :container-size="containerSize"
        />
      </template>
      
      <box-group
        v-for="(boxGroup, index) in boxGroups"
        :key="boxGroup.quantile.key"
        :box-group="boxGroup"
        :overlay="getOverlayConfig(index)"
        :is-hovered="hoveredIndex === index"
        @mouseover="handleMouseover(boxGroup.quantile, index, $event)"
        @mouseout="handleMouseout"
      />
    </chart-container>
    <popover
      v-if="popoverConfig.opened"
      v-bind="popoverConfig"
    >
      <div
        v-for="key in Object.keys(popoverQuantile)"
        :key="key"
      >
        <span class="u-font-weight-semi-bold">{{
          popoverQuantile[key].label
        }}</span>
        : {{ popoverQuantile[key].value }}
      </div>
    </popover>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  watch,
} from '@vue/composition-api';
import { quantile, group, ascending } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';

import Axis from '@/core/axis';
import BoxGroup from './components/box-group.vue';
import ChartContainer from '@/core/chart-container';
import Popover from '@/core/popover';

import { useBase } from '@/mixins/base';
import { useConfig, withConfig } from '@/mixins/config';
import { useOptions, withOptions } from '@/mixins/options';
import { usePopover } from '@/mixins/popover';

import { config as defaultConfig, options as defaultOptions } from './defaults';

type BoxPlotData = Array<{
  [key: string]: number | string;
}>;

export default defineComponent({
  components: { Axis, ChartContainer, BoxGroup, Popover },
  props: {
    ...withConfig(),
    ...withOptions(),
    data: {
      type: Array as PropType<BoxPlotData>,
      required: true,
    },
    margins: {
      type: Object,
      default: () => ({}),
    },
    groupByLabel: {
      type: String,
      required: true,
    },
    valueLabel: {
      type: String,
      required: true,
    },
  },
  setup(props, ctx) {
    // State from mixins
    const { containerSize, updateSize } = useBase(null, null);
    const { popoverConfig, showPopover, hidePopover } = usePopover();
    const { computedConfig } = useConfig(props.config, defaultConfig);
    const { allOptions } = useOptions(props.options, defaultOptions);

    // Internal state

    const hoveredIndex = ref<number>(-1);
    const popoverQuantile = ref(null);

    // Computed
    // TODO: Move to box-plot scales mixin

    const domain = computed(() => {
      return Array.from(
        new Set(props.data.map((ele) => ele[props.groupByLabel]))
      );
    });

    const values = computed(() => {
      return props.data.map((ele) => ele[props.valueLabel] as number);
    });

    const boxWidth = computed(() => {
      return containerSize.width / (1.3 * domain.value.length);
    });

    const xScale = computed(() => {
      return scaleBand()
        .range([0, containerSize.width])
        .domain(domain.value)
        .paddingInner(1)
        .paddingOuter(0.5);
    });

    const yScale = computed(() => {
      return scaleLinear()
        .domain([
          0.8 * Math.min(...values.value),
          1.1 * Math.max(...values.value),
        ])
        .range([containerSize.height, 0]);
    });

    const quantiles = computed(() => {
      const sumstat = [];
      // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
      group(props.data, (d) => d[props.groupByLabel]).forEach((values, key) => {
        const groupedValues = values.map((g) => g[props.valueLabel]);
        const q1 = quantile(groupedValues.sort(ascending), 0.25);
        const median = quantile(groupedValues.sort(ascending), 0.5);
        const q3 = quantile(groupedValues.sort(ascending), 0.75);
        const interQuantileRange = q3 - q1;
        const min = q1 - 1.5 * interQuantileRange;
        const max = q3 + 1.5 * interQuantileRange;
        sumstat.push({
          key,
          q1,
          median,
          q3,
          interQuantileRange: interQuantileRange,
          min: min,
          max: max,
        });
      });
      return sumstat;
    });

    const boxGroups = computed(() => {
      return quantiles.value.map((quantile) => ({
        quantile: {
          q1: { label: '25th percentile', value: quantile.q1.toFixed(2) },
          q2: { label: '75th percentile', value: quantile.q3.toFixed(2) },
          interQuantileRange: {
            label: 'Inter quantile range',
            value: quantile.interQuantileRange.toFixed(2),
          },
          median: { label: 'Median', value: quantile.median.toFixed(2) },
          min: { label: 'Minimum', value: quantile.min.toFixed(2) },
          max: { label: 'Maximum', value: quantile.max.toFixed(2) },
          key: quantile.key,
        },
        verticalLine: {
          x1: xScale.value(quantile.key),
          x2: xScale.value(quantile.key),
          y1: yScale.value(quantile.min),
          y2: yScale.value(quantile.max),
        },
        box: {
          x: xScale.value(quantile.key) - boxWidth.value / 2,
          y: yScale.value(quantile.q3),
          height: yScale.value(quantile.q1) - yScale.value(quantile.q3),
          width: boxWidth.value,
        },
        medianLine: {
          x1: xScale.value(quantile.key) - boxWidth.value / 2,
          x2: xScale.value(quantile.key) + boxWidth.value / 2,
          y1: yScale.value(quantile.median),
          y2: yScale.value(quantile.median),
        },
      }));
    });

    const yAxisLabel = computed(() => {
      if (allOptions.value.yAxisOptions?.withLabel === false) return;
      return allOptions.value.yAxisOptions?.label || props.valueLabel;
    });

    // Methods

    function validateProps() {
      const labels = props.data.reduce(
        (acc, curr) => Array.from(new Set([...acc, ...Object.keys(curr)])),
        []
      );
      if (
        !labels.includes(props.valueLabel) ||
        !labels.includes(props.groupByLabel)
      ) {
        console.error('Invalid prop');
      }
    }

    function getOverlayConfig(index: number) {
      return {
        transform: `translate(${xScale.value(domain.value[index]) -
          boxWidth.value / 2}, 0)`,
        width: xScale.value.step() - boxWidth.value / 4,
        height: containerSize.height,
      };
    }

    function handleMouseover(quantile, index: number, event: MouseEvent) {
      hoveredIndex.value = index;
      popoverQuantile.value = quantile;
      showPopover(event.target as HTMLElement);
      ctx.emit('mouseover', index);
    }

    function handleMouseout() {
      hoveredIndex.value = -1;
      popoverQuantile.value = null;
      hidePopover();
      ctx.emit('mouseout');
    }

    // Watchers

    watch(props, validateProps, { immediate: true });

    return {
      allOptions,
      boxGroups,
      computedConfig,
      containerSize,
      getOverlayConfig,
      handleMouseout,
      handleMouseover,
      hoveredIndex,
      popoverConfig,
      popoverQuantile,
      quantiles,
      updateSize,
      xScale,
      yAxisLabel,
      yScale,
    };
  },
});
</script>
