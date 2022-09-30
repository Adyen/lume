<template>
  <g
    v-if="scale && !isLoading"
    class="axis"
    :transform="axisTransform"
    data-j-axis
  >
    <g
      v-for="(tick, index) in ticks"
      v-bind="mixins.getTickGroupAttributes(tick)"
      :key="tick"
      class="axis__tick"
      :class="{
        'axis__tick--hovered': allOptions.withHover && hoveredIndex === index,
        'axis__tick--hidden': allOptions.skip && !showTick(index),
      }"
      data-j-axis__tick
    >
      <g
        class="axis__tick-label"
        pointer-events="all"
        data-j-axis__tick-label
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
import Vue, {
  computed,
  onBeforeMount,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import { format } from 'd3-format';
import { ticks as d3TickGenerator } from 'd3-array';
import { ScaleBand } from 'd3-scale';

import { AxisOptions, useOptions, withOptions } from '@/composables/options';
import { Scale } from '@/composables/scales';
import { useSkip } from './composables/axis-skip';

import { ContainerSize } from '@/types/size';
import { xOptions, yOptions } from './defaults';
import { AxisMixin, AxisMixinFunction } from './types';

import mixinTypes from './composables/';

const SCALE_MIXIN_MAP = {
  bandScale: 'band-scale-axis',
  linearScale: 'linear-scale-axis',
};

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
  ...withOptions<AxisOptions>(),
});

const emit = defineEmits(['tick-mouseover']);

const { scale, containerSize, options } = toRefs(props); // Needs to be cast as any to avoid it being cast to never by default

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
  if (computedType.value === 'x') {
    return `translate(0, ${containerSize.value?.height})`;
  }
  return `translate(0, 0)`;
});

const ticks = computed(() => {
  // For band scales, return the full labels array (domain)
  if ((scale.value as ScaleBand<string | number>).step) {
    return scale.value.domain();
  }

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

  return tickFormatter.value ? tickFormatter.value(tick as number) : tick;
}

function onTickMouseover(index: number) {
  emit('tick-mouseover', index);
}

async function init() {
  isLoading.value = true;
  const scaleType = (scale.value as ScaleBand<string | number>).step
    ? 'bandScale'
    : 'linearScale';

  // Get mixin generator based on the scale type
  const mixin: AxisMixin =
    mixinTypes[`${computedType.value}-${SCALE_MIXIN_MAP[scaleType]}`];

  // Push all mixin functions into the `mixins` reactive object
  Object.entries(mixin(scale, containerSize, allOptions) || []).forEach(
    ([fnName, fn]) => {
      Vue.set(mixins, fnName, fn);
    }
  );

  isLoading.value = false;
}

onBeforeMount(async () => {
  await init();

  // Setup watcher to get new mixins if scale changes (i.e. vertical to horizontal)
  watch(scale, init, { flush: 'sync' });
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
