<template>
  <chart-container
    :margins="allOptions.margins"
    @resize="updateSize"
    @mouseleave="handleMouseleave"
  >
    <!-- Negative values background -->
    <adv-bar
      v-if="hasNegativeValues"
      v-bind="negativeBarAttributes"
      fill-class="adv-fill-color-negative-values"
      :animate="false"
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
      />
      <adv-axis
        type="y"
        :scale="computedYScale"
        :container-size="containerSize"
        :options="options.yAxisOptions"
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
      :on-mouseover-fn="mouseOverHandler"
    />

    <!-- Tooltip anchor -->
    <g v-if="allOptions.withTooltip !== false">
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
        />
      </slot>
    </template>
  </chart-container>
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
import ChartContainer from '@/core/chart-container';
import Tooltip from '@/core/tooltip';

import { withBase, useBase } from '@/mixins/base';
import { isScale, Scale, useBaseScales, withScales } from '@/mixins/scales';
import { withOptions, useOptions } from '@/mixins/options';
import {
  checkNegativeValues,
  useNegativeValues,
} from '@/mixins/negative-values';
import { useTooltip, useTooltipAnchors } from '@/mixins/tooltip';
import { orientationValidator } from '@/core/adv-bar-group/mixins/bar-mixin';

import { NO_DATA, Orientation, ORIENTATIONS } from '@/constants';

export default defineComponent({
  components: { AdvAxis, AdvBar, ChartContainer, Tooltip },
  props: {
    ...withBase(),
    ...withScales(),
    ...withOptions(),
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

    const { xScale, yScale } = useBaseScales(
      computedData,
      labels,
      containerSize,
      orientation
    );

    const { allOptions } = useOptions(options);

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

    function handleMouseleave() {
      hoveredIndex.value = -1;
      hideTooltip();
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
