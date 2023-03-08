<template>
  <g
    v-if="scale"
    ref="root"
    class="axis"
    tabindex="0"
    aria-valuemin="computedMax"
    aria-valuemax="computedMin"
    :role="`${computedType}axis`"
    :transform="axisTransform"
    data-j-axis
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

    <template
      v-for="(tick, index) in ticksWithAttributes"
      :key="`${tick.value}_${index}`"
    >
      <g
        v-bind="tick.group"
        :id="getTickId(index)"
        class="axis__tick"
        :class="{
          'axis__tick--hovered': isHovering(index),
          'axis__tick--hidden': allOptions.skip && !showTick(index),
        }"
        data-j-axis__tick
      >
        <g
          class="axis__tick-label lume-typography--axis"
          pointer-events="all"
          data-j-axis__tick-label
          @mouseover="onTickMouseover(index)"
        >
          <rect
            v-bind="tick.ghost"
            class="axis__ghost"
            fill="url(#lume-tick-gradient)"
          />
          <text
            v-bind="tick.label"
            :id="`${computedType}-${index}`"
            ref="tickRefs"
            class="axis__label"
            role="axislabel"
            :data-index="index"
          >
            {{ formatTick(tick.value) }}
          </text>
        </g>

        <line
          v-if="allOptions.gridLines"
          v-bind="tick.gridLine"
          class="axis__grid-line"
        />
      </g>
    </template>

    <!-- Hovered tick -->
    <!-- <vue-portal-target
      :name="`${chartID}-${computedType}-hovered-portal`"
      slim
    /> -->
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
  toRefs,
  watch,
} from 'vue';
import { ticks as d3TickGenerator } from 'd3';
import { ScaleBand } from 'd3';

import { useFormat } from '@/composables/format';
import { AxisOptions, useOptions, withOptions } from '@/composables/options';
import { ComputedScaleBand, Scale } from '@/composables/scales';
import { useSkip } from './composables/lume-skip';

import { Orientation, ORIENTATIONS } from '@/utils/constants';
import { isBandScale } from '@/utils/helpers';
import { svgCheck } from '@/utils/svg-check';
import { ContainerSize } from '@/types/size';
import { xOptions, yOptions } from './defaults';
import { AxisMixin, AxisMixinFunction } from './types';

import mixinTypes from './composables/';

const props = defineProps({
  scale: {
    type: Function as PropType<Scale>,
    required: true,
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
  (e: 'tick-mouseover', value: number): void;
}>();

const { scale, containerSize, hoveredIndex, options, orientation } =
  toRefs(props); // Needs to be cast as any to avoid it being cast to never by default

const mixins = reactive<Record<string, AxisMixinFunction>>({});
const tickRefs = ref<Array<SVGTextElement>>(null);
const root = ref<SVGGElement>(null);
const ticksWithAttributes = ref(null);

const chartID = inject('chartID');

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

const computedMin = computed(() => scale.value.domain()[0]);
const computedMax = computed(() => {
  const domain = scale.value.domain();
  return domain[domain.length - 1];
});

const { allOptions } = useOptions<AxisOptions>(
  options,
  computedType.value === 'x' ? xOptions : yOptions
);

const { showTick } = useSkip(scale, tickRefs, allOptions.value.skip);

const axisTransform = computed(
  () =>
    `translate(0, ${
      computedType.value === 'x' ? containerSize.value?.height : 0
    })`
);

const ticks = computed(() => {
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

function formatTick(tick: number | string) {
  const { showTicks } = allOptions.value;

  // Hides ticks without hiding `gridLines`
  if (showTicks === false) return '';

  return tickFormatter.value(tick);
}

function onTickMouseover(index: number) {
  shouldHover.value && emit('tick-mouseover', index);
}

function isHovering(index: number) {
  return (
    allOptions.value.withHover &&
    shouldHover.value &&
    hoveredIndex.value === index
  );
}

function getTickId(index: number) {
  return `${chartID}-${computedType.value}-tick--${index}`;
}

// Needed because tick element index changes in the `tickRefs` array
function getTextNode(index: number) {
  if (!tickRefs.value) return;
  return tickRefs.value.find((tick) => +tick.dataset.index === index);
}

function setTicks() {
  ticksWithAttributes.value = ticks.value.map((tick, index) => {
    return {
      value: tick,
      group: mixins.getTickGroupAttributes(tick, index),
      ghost: mixins.getTickGhostAttributes(getTextNode(index)),
      label: mixins.getTickLabelAttributes(),
      gridLine: mixins.getGridLinesAttributes(),
    };
  });
}

function init() {
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

// Re-render after `tickRefs` is defined (to grab text width)
// and only when `ticks` change (if scale changes)
watch(
  [
    ticks,
    tickRefs,
    () => containerSize.value.width, //  also re-render
    () => containerSize.value.height, // when containerSize changes
  ],
  setTicks,
  { immediate: true }
);

onMounted(() => svgCheck(root.value));
</script>

<style lang="scss" scoped>
@use './styles';
</style>
