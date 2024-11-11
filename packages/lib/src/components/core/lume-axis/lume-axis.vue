<template>
  <g
    v-if="scale"
    ref="root"
    class="axis"
    :transform="axisTransform"
    data-j-axis
    @mouseleave="emit('mouseleave', $event)"
  >
    <defs v-if="computedType === 'x'">
      <linearGradient id="lume-tick-gradient">
        <stop
          offset="0%"
          stop-color="rgba(255,255,255,0)"
        />
        <stop
          offset="10%"
          stop-color="var(--lume-chart-background-color)"
        />
        <stop
          offset="90%"
          stop-color="var(--lume-chart-background-color)"
        />
        <stop
          offset="100%"
          stop-color="rgba(255,255,255,0)"
        />
      </linearGradient>
    </defs>

    <lume-tick
      v-for="(tick, index) in ticksWithAttributes"
      :key="`${tick.value}_${index}`"
      ref="tickRefs"
      v-bind="tick"
      :is-hidden="allOptions.skip && !showTick(index)"
      :with-gridlines="allOptions.gridLines"
      @mouseenter="handleTickMouseenter(index, tick.value, $event)"
      @click="handleTickClick(index, tick.value, $event)"
    />

    <!-- Hovered tick -->
    <!-- Has to be copied over to after all other ticks so that it shows on top. (z-index doesn't work for SVG) -->
    <lume-tick
      v-if="isHovering"
      v-bind="ticksWithAttributes[hoveredIndex]"
      :with-gridlines="false"
      is-hovered
      @click="
        handleTickClick(
          hoveredIndex,
          ticksWithAttributes[hoveredIndex].value,
          $event
        )
      "
    />
  </g>
</template>

<script lang="ts">
enum SCALE_MIXIN_MAP {
  bandScale = 'band-scale-axis',
  linearScale = 'linear-scale-axis',
}
enum POSITIONS {
  left = 'left',
  bottom = 'bottom',
}
enum TYPES {
  x = POSITIONS.bottom,
  y = POSITIONS.left,
}
</script>

<script setup lang="ts">
import {
  computed,
  inject,
  onMounted,
  PropType,
  reactive,
  ref,
  Ref,
  toRefs,
  watch,
} from 'vue';
import { ticks as d3TickGenerator, ScaleBand } from 'd3';

import LumeTick from './components/lume-tick';

import { useFormat } from '@/composables/format';
import { useOptions, withOptions } from '@/composables/options';
import { ComputedScaleBand, Scale } from '@/composables/scales';
import { useSkip } from './composables/lume-skip';

import { AXIS_GHOST_PADDING, ORIENTATIONS } from '@/utils/constants';
import { isBandScale, isScaleEmpty } from '@/utils/helpers';
import { svgCheck } from '@/utils/svg-check';
import type { ContainerSize } from '@/types/size';
import type { AxisOptions } from '@/types/options';
import type { Orientation } from '@/types/utils';
import type { AxisMixin, AxisMixinFunction, TickAttributes } from './types';

import { xOptions, yOptions } from './defaults';

import mixinTypes from './composables/';

const AXIS_LABEL_OFFSET = 16; // 8px + 8px on each side

const props = defineProps({
  scale: {
    type: Function as PropType<Scale>,
    default: null,
  },
  type: {
    type: String,
    default: undefined,
    validator: (value: string) => value in TYPES,
  },
  position: {
    type: String as PropType<POSITIONS>,
    default: undefined,
    validator: (value: string) => value in POSITIONS,
  },
  containerSize: {
    type: Object as PropType<ContainerSize>,
    default: () => ({ width: 0, height: 0 }),
  },
  hoveredIndex: {
    type: Number,
    default: -1,
  },
  orientation: {
    type: String as PropType<Orientation>,
    default: ORIENTATIONS.VERTICAL,
  },
  ...withOptions<AxisOptions>(),
});

const emit = defineEmits<{
  (
    e: 'mouseenter' | 'click',
    p: { index?: number; value: string | number; event: MouseEvent }
  ): void;
  (e: 'mouseleave', p: MouseEvent): void;
  (e: 'lume__internal--axis-size', p: number);
}>();

const { scale, containerSize, hoveredIndex, options, orientation } =
  toRefs(props); // Needs to be cast as any to avoid it being cast to never by default

const isEmpty = inject<Ref<boolean>>('isEmpty', ref(false));

const mixins = reactive<Record<string, AxisMixinFunction>>({});
const tickRefs = ref<Array<{ ref: SVGTextElement }>>(null);
const root = ref<SVGGElement>(null);
const ticksWithAttributes = ref<Array<TickAttributes>>(null);

const computedPosition = computed(() =>
  props.type ? TYPES[props.type] : props.position
);

const computedType = computed(
  () => props.type || (computedPosition.value === 'left' ? 'y' : 'x')
);

const shouldHover = computed(
  () =>
    (computedType.value === 'x' &&
      orientation.value === ORIENTATIONS.VERTICAL) ||
    (computedType.value === 'y' &&
      orientation.value === ORIENTATIONS.HORIZONTAL)
);

const { allOptions } = useOptions<AxisOptions>(
  options,
  computedType.value === 'x' ? xOptions : yOptions
);

const { showTick } = useSkip(scale, tickRefs, allOptions);

const alignAxisBaseline = computed(
  () => isEmpty.value || !scale.value || isScaleEmpty(scale.value)
);

const axisTransform = computed(() => {
  // if empty, aligns baseline to the bottom
  if (computedType.value === 'y' && alignAxisBaseline.value) {
    return `translate(0, ${containerSize.value?.height / 2})`;
  }

  // if empty, aligns baseline to the left
  if (computedType.value === 'x' && alignAxisBaseline.value) {
    return `translate(-${containerSize.value?.width / 2}, ${
      containerSize.value?.height
    })`;
  }

  return `translate(0, ${
    computedType.value === 'x' ? containerSize.value?.height : 0
  })`;
});

const ticks = computed(() => {
  if (!scale.value) return [];

  // For band scales, return the full labels array (domain)
  if (isBandScale(scale.value)) {
    return (scale.value as ComputedScaleBand).labels || scale.value.domain();
  }

  const { tickCount } = allOptions.value;
  const [start, end] = scale.value.domain() as number[];

  return d3TickGenerator(start, end, tickCount);
});

const tickFormatter = computed(() => {
  const { tickFormat } = allOptions.value;
  return useFormat(tickFormat);
});

const isHovering = computed(
  () =>
    allOptions.value.withHover && shouldHover.value && hoveredIndex.value > -1
);

const axisLabelOffset = computed(
  () => allOptions.value.tickPadding + AXIS_GHOST_PADDING || AXIS_LABEL_OFFSET
);

const axisSize = computed(() => {
  return computedType.value === 'x'
    ? // If x axis, get the tick height
    Math.max(
      ...(tickRefs.value || []).map(
        (tick) => tick.ref.getBBox?.().height + axisLabelOffset.value
      )
    )
    : // If y axis, get the tick width
    Math.max(
      ...(tickRefs.value || []).map(
        (tick) => tick.ref.getBBox?.().width + axisLabelOffset.value
      )
    );
});

function formatTick(tick: number | string) {
  const { showTicks } = allOptions.value;

  // Hides ticks without hiding `gridLines`
  if (showTicks === false) return '';

  return tickFormatter.value(tick);
}

function handleTickMouseenter(
  index: number,
  value: string | number,
  event: MouseEvent
) {
  emit('mouseenter', { index: shouldHover.value ? index : null, value, event });
}

function handleTickClick(
  index: number | null,
  value: string | number,
  event: MouseEvent
) {
  emit('click', { index, value, event });
}

function getTextNode(index: number) {
  if (!tickRefs.value || !tickRefs.value.length) return;
  return tickRefs.value[index]?.ref;
}

function setTicks() {
  ticksWithAttributes.value = ticks.value.map(
    (tick: string | number, index: number) => ({
      value: formatTick(tick),
      group: mixins.getTickGroupAttributes(tick, index),
      ghost: mixins.getTickGhostAttributes(getTextNode(index)),
      label: mixins.getTickLabelAttributes(),
      gridline: mixins.getGridLinesAttributes(),
    })
  );
}

function updateGridlines() {
  if (ticksWithAttributes.value) {
    ticksWithAttributes.value.map((tick) => {
      tick.gridline = mixins.getGridLinesAttributes();
      return tick;
    });
  }
}

function init() {
  if (!scale.value) return;

  const scaleType = (scale.value as ScaleBand<string | number>).step
    ? 'bandScale'
    : 'linearScale';

  // Get mixin generator based on the scale type
  const mixin: AxisMixin =
    mixinTypes[`${computedType.value}-${SCALE_MIXIN_MAP[scaleType]}`];

  // Push all mixin functions into the `mixins` reactive object
  Object.entries(mixin(scale, containerSize, allOptions) || []).forEach(
    ([fnName, fn]) => {
      mixins[fnName] = fn;
    }
  );
}

// Setup watcher to get new mixins if scale changes (i.e. vertical to horizontal)
watch(scale, init, { flush: 'sync', immediate: true });

// Re-render after scale changes (new containerSize, new values, scale override, etc.)
watch(scale, setTicks, { immediate: true });
// Re-render after `tickRefs` is defined (to grab text width)
watch(tickRefs, setTicks);

watch(axisSize, (size) => emit('lume__internal--axis-size', size));

// Re-calculate gridlines when container size changes
// This is needed for cases where the container width changes, so the Y gridlines need to update,
// but the Y scale doesn't change since the height is the same
watch(props.containerSize, updateGridlines);

onMounted(() => svgCheck(root.value));
</script>
