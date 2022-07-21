<template>
  <g
    v-if="scale && !isLoading"
    data-j-axis
    class="axis"
    :transform="axisTransform"
    data-j-axis
  >
    <text
      v-if="allOptions.withTitle"
      v-bind="titlePosition"
      class="axis__title"
      :class="{ 'axis__title--horizontal': computedType === 'y' }"
    >
      {{ title || allOptions.title }}
    </text>

    <g
      v-for="(tick, index) in ticks"
      v-bind="mixins.getTickGroupAttributes(tick)"
      :key="tick"
      class="axis__tick"
      :class="{
        'axis__tick--hovered': hoveredIndex === index,
        'axis__tick--hidden': allOptions.skip && !showTick(index),
      }"
    >
      <g
        class="axis__tick-label"
        pointer-events="all"
        @mouseover="onTickMouseover(index)"
      >
        <rect
          v-bind="mixins.getTickGhostAttributes()"
          class="axis__ghost"
        />
        <text
          v-bind="mixins.getTickLabelAttributes()"
          ref="tickRefs"
          class="axis__label"
        >
          {{ formatTick(tick) }}
        </text>
      </g>

      <line
        v-if="allOptions.gridLines"
        v-bind="mixins.getGridLinesAttributes()"
        class="axis__grid-line"
      />
    </g>
  </g>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  reactive,
  ref,
  set,
  toRefs,
  watch,
} from '@vue/composition-api';
import { format } from 'd3-format';
import { ticks as d3TickGenerator } from 'd3-array';

import { AxisOptions, useOptions, withOptions } from '@/mixins/options';
import { Scale } from '@/mixins/scales';
import { useSkip } from './mixins/axis-skip';

import { xOptions, yOptions } from './defaults';
import { AxisMixin, AxisMixinFunction } from './types';
import { ScaleBand } from 'd3-scale';

const SCALE_MIXIN_MAP = {
  bandScale: 'band-scale-axis',
  linearScale: 'linear-scale-axis',
};

const POSITIONS = ['bottom', 'left'];

const TYPES = {
  x: 'bottom',
  y: 'left',
};

const LABEL_HEIGHT = 14; // 14px
const LABEL_PADDING = 12; // 12px

const LABEL_MARGIN = {
  y: LABEL_HEIGHT + LABEL_PADDING,
};

interface AxisProps {
  scale: Scale;
  type?: 'x' | 'y';
  position?: 'bottom' | 'left';
  title?: string;
  containerSize: { width: number; height: number };
  hoveredIndex?: number;
  options: AxisOptions;
}

export default defineComponent({
  props: {
    scale: {
      type: Function as PropType<Scale>,
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
    title: {
      type: String,
      default: null,
    },
    containerSize: {
      type: Object,
      default: () => ({ width: 0, height: 0 }),
    },
    hoveredIndex: {
      type: Number,
      default: -1,
    },
    ...withOptions<AxisOptions>(),
  },
  setup(props: AxisProps, ctx) {
    const { scale, containerSize, options } = toRefs<AxisProps>(props); // Needs to be cast as any to avoid it being cast to never by default

    const mixins = reactive<Record<string, AxisMixinFunction>>({});
    const tickRefs = ref<Array<SVGTextElement>>(null);
    const isLoading = ref<boolean>(false);

    const computedPosition = computed(() =>
      props.type ? TYPES[props.type] : props.position
    );

    const computedType = computed(
      () => props.type || (computedPosition.value === 'left' ? 'y' : 'x')
    );

    const { allOptions } = useOptions<AxisOptions>(
      options,
      computedType.value === 'x' ? xOptions : yOptions
    );

    const { showTick } = useSkip(scale, tickRefs, allOptions.value.skip);

    const axisTransform = computed(() => {
      if (computedType.value === 'x')
        return `translate(0, ${containerSize.value?.height})`;
      return `translate(0, 0)`;
    });

    const titlePosition = computed(() =>
      computedType.value === 'y'
        ? {
          x: 0,
          y: -LABEL_MARGIN[computedType.value],
        }
        : {
          x: containerSize.value?.width / 2,
          y: 2 * LABEL_HEIGHT + LABEL_PADDING,
        }
    );

    const ticks = computed(() => {
      // For band scales, return the full labels array (domain)
      if ((scale.value as ScaleBand<string | number>).step)
        return scale.value.domain();

      const { tickCount } = allOptions.value;
      return d3TickGenerator(...scale.value.domain(), tickCount);
    });

    const tickFormatter = computed(() => {
      const { tickFormat } = allOptions.value;

      if (typeof tickFormat === 'string') {
        const formatter = format(tickFormat);
        return formatter;
      }

      if (typeof tickFormat === 'function') {
        return tickFormat;
      }

      return null;
    });

    function formatTick(tick: number | string) {
      const { showTicks } = allOptions.value;

      // Hides ticks without hiding `gridLines`
      if (showTicks === false) return '';

      return tickFormatter.value?.(tick) || tick;
    }

    function onTickMouseover(index: number) {
      ctx.emit('tick-mouseover', index);
    }

    async function init() {
      isLoading.value = true;
      const scaleType = (scale.value as ScaleBand<string | number>).step
        ? 'bandScale'
        : 'linearScale';

      // Get mixin generator based on the scale type
      const mixin: AxisMixin = (
        await import(
          `./mixins/${computedType.value}-${SCALE_MIXIN_MAP[scaleType]}`
        )
      ).default;

      // Push all mixin functions into the `mixins` reactive object
      Object.entries(mixin(scale, containerSize, allOptions)).forEach(
        ([fnName, fn]) => {
          set(mixins, fnName, fn);
        }
      );

      isLoading.value = false;
    }

    onBeforeMount(async () => {
      await init();

      // Setup watcher to get new mixins if scale changes (i.e. vertical to horizontal)
      watch(scale, init, { flush: 'sync' });
    });

    return {
      allOptions,
      axisTransform,
      computedPosition,
      computedType,
      formatTick,
      isLoading,
      mixins,
      onTickMouseover,
      showTick,
      tickRefs,
      ticks,
      titlePosition,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/variables' as *;

$axis-title-color: $adv-color-grey-50;
$axis-label-color: $adv-color-grey-30;
$axis-label-hover-color: $adv-color-grey-70;
$axis-line-color: $adv-color-grey-20;

$axis-title-font-size: 14px;
$axis-label-font-size: 10px;

.axis {
  &__title {
    fill: $axis-title-color;
    font-size: $axis-title-font-size;
    text-anchor: start;

    &--horizontal {
      text-anchor: middle;
    }
  }

  &__ghost {
    fill: transparent;
  }

  &__grid-line {
    fill: none;
    stroke: $axis-line-color;
    shape-rendering: crispEdges;
  }

  &__label {
    fill: $axis-label-color;
    font-size: $axis-label-font-size;
    cursor: default;
    transition: all $chart-overlay-transition-time ease-in-out;
  }

  &__tick {
    transition: opacity $chart-overlay-transition-time ease-in-out;

    &--hidden {
      opacity: 0;
    }

    &--hovered {
      opacity: 1;

      .axis__ghost {
        fill: $chart-background-color;
      }

      .axis__label {
        fill: $axis-label-hover-color;
      }
    }
  }
}
</style>
