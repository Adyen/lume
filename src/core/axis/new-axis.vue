<template>
  <g
    v-if="scale && mixins.getTickGroupAttributes"
    class="axis"
    :transform="axisTransform"
  >
    <text
      v-if="title"
      ref="title"
      v-bind="titlePosition"
      class="axis__title"
    >
      {{ title }}
    </text>
    <g
      v-for="(tick, index) in ticks"
      :key="tick"
      class="axis__tick"
      :class="{ 'axis__tick--hovered': hoveredIndex === index }"
      v-bind="mixins.getTickGroupAttributes(tick)"
    >
      <rect
        v-bind="mixins.getTickGhostAttributes()"
        class="axis__ghost"
        @mouseover="onTickMouseover(index)"
      />
      <line
        v-if="allOptions.gridLines"
        v-bind="mixins.getGridLinesAttributes()"
        class="axis__grid-line"
      />
      <text
        class="axis__label"
        v-bind="mixins.getTickLabelAttributes()"
      >
        {{ tick }}
      </text>
    </g>
  </g>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  set,
  toRefs,
} from '@vue/composition-api';

import { AxisOptions, useOptions, withOptions } from '@/mixins/options';

import { options as defaultOptions } from './defaults';

const SCALE_MIXIN_MAP = {
  bandScale: 'band-scale-axis',
  linearScale: 'linear-scale-axis',
};

const POSITIONS = ['left', 'top', 'right', 'bottom'];

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
  setup(props, ctx) {
    const { scale, containerSize, options } = toRefs<any>(props); // Needs to be cast as any to avoid it being cast to never by default
    const { allOptions } = useOptions<AxisOptions>(options, defaultOptions);

    const mixins = reactive<Record<string, any>>({});

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

    const axisTransform = computed(() => {
      if (computedType.value === 'x')
        return `translate(0, ${containerSize.value?.height})`;
      return `translate(0, 0)`;
    });

    const titlePosition = computed(() => ({
      x: 0,
      y: -LABEL_MARGIN[computedType.value],
    }));

    const ticks = computed(() => {
      if (scale.value.ticks) return scale.value.ticks();
      if (scale.value.step) return scale.value.domain();

      return [];
    });

    function onTickMouseover(index: number) {
      ctx.emit('tick-mouseover', index);
    }

    async function init() {
      const scaleType = scale.value.step ? 'bandScale' : 'linearScale';
      const mixin = (await import(`./mixins/${SCALE_MIXIN_MAP[scaleType]}`))
        .default;

      Object.entries(mixin(scale, containerSize)).forEach(([fnName, fn]) => {
        set(mixins, fnName, fn);
      });
    }

    init();

    return {
      allOptions,
      axisTransform,
      computedPosition,
      computedType,
      mixins,
      titlePosition,
      onTickMouseover,
      ticks,
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

  &__tick--hovered {
    .axis__ghost {
      fill: $chart-background-color;
    }

    .axis__label {
      fill: $axis-label-hover-color;
    }
  }
}
</style>
