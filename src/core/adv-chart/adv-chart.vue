<template>
  <adv-chart-container
    :margins="allOptions.margins"
    data-j-adv-chart
    @resize="updateSize"
    @mouseleave="handleMouseleave"
  >
    <!-- Negative values background -->
    <adv-bar
      v-if="hasNegativeValues"
      v-bind="negativeBarAttributes"
      fill-class="adv-fill-color-negative-values"
      :animate="false"
      data-j-adv-chart__negative-values
    />

    <!-- Axes -->
    <slot
      v-if="allOptions.showAxes !== false"
      name="axes"
      :x-scale="computedXScale"
      :y-scale="computedYScale"
      :container-size="containerSize"
      :options="allOptions"
    >
      <adv-axis
        type="x"
        :scale="computedXScale"
        :container-size="containerSize"
        :options="options.xAxisOptions"
        @tick-mouseover="handleTickMouseover('x', $event)"
      />
      <adv-axis
        type="y"
        :scale="computedYScale"
        :container-size="containerSize"
        :options="options.yAxisOptions"
        @tick-mouseover="handleTickMouseover('y', $event)"
      />
    </slot>

    <!-- Data groups -->
    <slot
      name="groups"
      :data="computedData"
      :labels="labels"
      :orientation="orientation"
      :x-scale="computedXScale"
      :y-scale="computedYScale"
      :hovered-index="hoveredIndex"
    />

    <!-- Overlay bars -->
    <adv-overlay-group
      v-if="allOptions.withHover !== false"
      :data="computedData"
      :orientation="orientation"
      :x-scale="computedXScale"
      :y-scale="computedYScale"
      @mouseover="mouseOverHandler"
    />

    <!-- Tooltip anchor -->
    <g
      v-if="allOptions.withTooltip !== false"
      data-j-adv-chart__tooltip
    >
      <circle
        v-for="(_, index) in computedData[0].values"
        v-bind="getTooltipAnchorAttributes(index)"
        ref="tooltipAnchor"
        :key="`anchor-${index}`"
      />
    </g>

    <template #extra>
      <slot name="tooltip">
        <tooltip
          v-if="allOptions.withTooltip !== false && tooltipConfig.opened"
          v-bind="tooltipConfig"
          position="top"
          :title="labels[hoveredIndex]"
          :items="getTooltipItems(hoveredIndex)"
          :options="allOptions.tooltipOptions"
        />
      </slot>
    </template>
  </adv-chart-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRefs,
} from '@vue/composition-api';

import AdvAxis from '@/core/adv-axis';
import AdvBar from '@/core/adv-bar';
import AdvChartContainer from '@/core/adv-chart-container';
import AdvOverlayGroup from '@/core/adv-overlay-group';
import Tooltip from '@/core/tooltip';

import { withBase, useBase } from '@/mixins/base';
import { isScale, Scale, useBaseScales, withScales } from '@/mixins/scales';
import { ChartOptions, withOptions, useOptions } from '@/mixins/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';
import { useTooltip, useTooltipAnchors } from '@/mixins/tooltip';
import { orientationValidator } from '@/core/adv-bar-group/mixins/bar-mixin';

import { NO_DATA, Orientation, ORIENTATIONS } from '@/constants';

export default defineComponent({
  components: { AdvAxis, AdvBar, AdvChartContainer, AdvOverlayGroup, Tooltip },
  props: {
    ...withBase(),
    ...withScales(),
    ...withOptions<ChartOptions>(),
    orientation: {
      type: String as PropType<Orientation>,
      default: ORIENTATIONS.VERTICAL,
      validator: orientationValidator,
    },
  },
  setup(props, ctx) {
    const { data, labels, options, orientation } = toRefs(props);

    const hoveredIndex = ref<number>(-1);
    const tooltipAnchor = ref<SVGCircleElement>(null);

    const { computedData, containerSize, updateSize } = useBase(data, labels);

    const { allOptions } = useOptions<ChartOptions>(options);

    const { xScale, yScale } = useBaseScales(
      computedData,
      labels,
      containerSize,
      orientation,
      allOptions
    );

    const computedXScale = computed<Scale>(() => {
      if (!props.xScale) return xScale.value;
      return isScale(props.xScale)
        ? props.xScale
        : props.xScale?.(computedData.value, labels.value, containerSize);
    });

    const computedYScale = computed<Scale>(() => {
      if (!props.yScale) return yScale.value;
      return isScale(props.yScale)
        ? props.yScale
        : props.yScale?.(computedData.value, labels.value, containerSize);
    });

    const { hasNegativeValues } = checkNegativeValues(computedData);
    const { negativeBarAttributes } = useNegativeValues(
      containerSize,
      computedXScale,
      computedYScale,
      orientation
    );

    const { tooltipConfig, showTooltip, hideTooltip } = useTooltip();

    const { getTooltipAnchorAttributes } = useTooltipAnchors(
      computedData,
      computedXScale,
      computedYScale,
      orientation
    );

    function getTooltipItems(index: number) {
      return computedData.value.map(({ color, label, values, type }) => ({
        type: type || 'line',
        color,
        label,
        value: values[index]?.value ?? NO_DATA,
      }));
    }

    const mouseOverHandler = computed(() => {
      const handler = (index: number) => {
        // Update hoveredIndex
        allOptions.value.withHover !== false && (hoveredIndex.value = index);

        // Show/update tooltip
        allOptions.value.withTooltip !== false &&
          showTooltip(tooltipAnchor.value[index]);
      };

      return handler;
    });

    function handleTickMouseover(type: 'x' | 'y', index: number) {
      // Only capture hover on the label axis
      if (
        (orientation.value === ORIENTATIONS.VERTICAL && type === 'x') ||
        (orientation.value === ORIENTATIONS.HORIZONTAL && type === 'y')
      ) {
        mouseOverHandler.value(index);
      }
    }

    function handleMouseleave() {
      hoveredIndex.value = -1;
      hideTooltip();
    }

    onMounted(() => {
      if (!ctx.slots.groups?.()) {
        console.error('"groups" `<slot>` must have content.');
      }
    });

    return {
      allOptions,
      computedData,
      computedXScale,
      computedYScale,
      containerSize,
      getTooltipAnchorAttributes,
      getTooltipItems,
      handleMouseleave,
      handleTickMouseover,
      hasNegativeValues,
      hoveredIndex,
      mouseOverHandler,
      negativeBarAttributes,
      tooltipAnchor,
      tooltipConfig,
      updateSize,
    };
  },
});
</script>
