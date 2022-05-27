<template>
  <g
    ref="root"
    class="axis"
    :data-type="computedType"
    :transform="computedTransform"
  >
    <text
      v-if="label"
      ref="label"
      v-bind="labelPosition"
      class="axis__label"
    >
      {{ label }}
    </text>
  </g>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  onMounted,
  watch,
} from '@vue/composition-api';
import { axisBottom, axisLeft, axisRight, axisTop } from 'd3-axis';
import { select } from 'd3-selection';
import { format } from 'd3-format';

import { useOptions, withOptions } from '@/mixins/options';

import { options as defaultOptions } from './defaults';

const POSITIONS = ['left', 'top', 'right', 'bottom'];

const AXIS_MAP = {
  left: axisLeft,
  right: axisRight,
  top: axisTop,
  bottom: axisBottom,
};

const TYPES = {
  x: 'bottom',
  y: 'left',
};

const LABEL_HEIGHT = 14; // 14px
const LABEL_PADDING = 12; // 12px

const LABEL_MARGIN = {
  y: LABEL_HEIGHT + LABEL_PADDING,
};

export default defineComponent({
  props: {
    scale: {
      type: Function,
      required: true,
    },
    type: {
      type: String,
      default: null,
      validator: (value: string) => value in TYPES,
    },
    position: {
      type: String,
      default: null,
      validator: (value: string) => POSITIONS.includes(value),
    },
    label: {
      type: String,
      default: null,
    },
    containerSize: {
      type: Object,
      default: () => ({ width: 0, height: 0 }),
    },
    transform: {
      type: String,
      default: null,
    },
    ...withOptions(),
  },
  setup(props) {
    const { allOptions } = useOptions(props.options, defaultOptions);
    const root = ref(null);
    const selection = ref(null);

    const computedPosition = computed(() =>
      props.type ? TYPES[props.type] : props.position
    );

    const computedType = computed(
      () =>
        props.type ||
        (computedPosition.value === 'left' || computedPosition.value === 'right'
          ? 'y'
          : 'x')
    );

    const tickSize = computed(() => {
      if (allOptions.value.gridLines) {
        const { width, height } = props.containerSize;
        return computedType.value === 'y' ? width : height;
      }
      return 0;
    });

    const tickFormat = computed(() => {
      const { showTicks, tickFormat } = allOptions.value;

      // Hides ticks without hiding `gridLines`
      if (showTicks === false) return '';

      if (typeof tickFormat === 'string') {
        const formatter = format(tickFormat);
        return formatter;
      }

      if (typeof tickFormat === 'function') {
        return tickFormat;
      }

      return null;
    });

    const axis = computed(() => {
      if (!props.scale) return;
      const axis = AXIS_MAP[computedPosition.value](props.scale);
      return axis
        .ticks(allOptions.value.tickCount)
        .tickSize(tickSize.value) // Used to draw grid lines
        .tickPadding(allOptions.value.tickPadding)
        .tickFormat(tickFormat.value);
    });

    const translateX = computed(() => {
      const xValue = tickSize.value || props.containerSize.width || 0;

      // For axes rendering grid lines
      if (tickSize.value) return computedPosition.value === 'left' ? xValue : 0;

      if (computedPosition.value === 'right') return xValue;

      return 0;
    });

    const translateY = computed(() => {
      const yValue = tickSize.value || props.containerSize.height || 0;

      // For axes rendering grid lines
      if (tickSize.value) return computedPosition.value === 'top' ? yValue : 0;

      if (computedPosition.value === 'bottom') return yValue;

      return 0;
    });

    const computedTransform = computed(() => {
      if (props.transform) return props.transform;
      return `translate(${translateX.value}, ${translateY.value})`;
    });

    const labelPosition = computed(() => ({
      x: '-100%',
      y: -LABEL_MARGIN[computedType.value],
    }));

    function applyAxis() {
      selection.value?.call(axis.value);
    }

    onMounted(() => {
      selection.value = select(root.value);
      applyAxis();
    });

    watch([props.scale, allOptions], applyAxis);

    return {
      root,
      computedPosition,
      computedType,
      axis,
      computedTransform,
      labelPosition,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

$axis-label-color: $adv-color-grey-50;
$axis-text-color: $adv-color-grey-30;
$axis-line-color: $adv-color-grey-20;

$axis-label-font-size: 14px;
$axis-text-font-size: 10px;

.axis ::v-deep {
  .domain {
    opacity: 0;
  }

  text {
    fill: $axis-text-color;
    font-size: $axis-text-font-size;
  }

  .axis__label {
    fill: $axis-label-color;
    font-size: $axis-label-font-size;
    text-anchor: start;
  }

  line {
    fill: none;
    stroke: $axis-line-color;
    shape-rendering: crispEdges;
  }
}
</style>
