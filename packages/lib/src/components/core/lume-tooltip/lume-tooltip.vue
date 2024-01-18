<template>
  <div
    v-show="opened && targetElement"
    ref="root"
    class="lume-tooltip lume-typography--caption"
    :class="{
      'lume-tooltip--pointer-events': options.withPointerEvents,
    }"
    data-j-tooltip
    @mouseenter="emit('tooltip-mouseenter')"
    @mouseleave="emit('tooltip-mouseleave')"
  >
    <slot>
      <!-- Default chart tooltip content -->
      <slot name="title">
        <lume-tooltip-title v-if="showTitle">
          {{ formatTitle(title) }}
        </lume-tooltip-title>
      </slot>
      <ul class="lume-tooltip__items">
        <slot name="summary">
          <lume-tooltip-summary v-if="hasSummary">
            {{ summaryItem.label }}
            <template
              v-if="summaryItem.value"
              #value
            >
              {{ formatValue(summaryItem.value) }}
            </template>
          </lume-tooltip-summary>
        </slot>
        <li
          v-if="hasSummary"
          class="lume-tooltip__break"
        >
          <hr>
        </li>
        <slot name="items">
          <lume-tooltip-item
            v-for="item in computedItems"
            :key="item.label"
            :color="item.color"
          >
            <template #label>
              {{ item.label }}
            </template>
            <template #value>
              {{ formatValue(item.value) }}
            </template>
          </lume-tooltip-item>
        </slot>
      </ul>
    </slot>
  </div>
</template>

<script lang="ts">
interface TooltipItem {
  color?: string;
  label: string;
  value?: number | string;
  isSummary?: true;
}
</script>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  Ref,
  toRefs,
  useSlots,
  watch,
} from 'vue';
import {
  createPopper,
  Placement,
  Instance as PopperInstance,
  PositioningStrategy,
} from '@popperjs/core';

import LumeTooltipTitle from './components/lume-tooltip-title';
import LumeTooltipSummary from './components/lume-tooltip-summary';
import LumeTooltipItem from './components/lume-tooltip-item';

import { useFormat } from '@/composables/format';
import { TooltipOptions, useOptions, withOptions } from '@/composables/options';

import { TOOLTIP_POSITIONS } from '@/utils/constants';

const props = defineProps({
  opened: {
    type: Boolean,
    default: false,
  },
  targetElement: {
    type: Element,
    default: null,
  },
  items: {
    type: Array as PropType<Array<TooltipItem>>,
    required: true,
  },
  position: {
    type: String as PropType<Placement>,
    default: 'auto',
    validator: (value: string) =>
      TOOLTIP_POSITIONS.includes(value as (typeof TOOLTIP_POSITIONS)[number]),
  },
  fixedPositioning: {
    type: Boolean,
    default: false,
  },
  inverse: {
    type: Boolean,
    default: false,
  },
  modifiers: {
    type: Array,
    default: null,
  },
  title: {
    type: [String, Number],
    default: null,
  },
  summary: {
    type: String,
    default: null,
  },
  ...withOptions<TooltipOptions>(),
});

const emit = defineEmits<{
  (e: 'opened', p: Element);
  (e: 'moved', p: Element);
  (e: 'closed');
  (e: 'tooltip-mouseenter');
  (e: 'tooltip-mouseleave');
}>();

// Refs
const root = ref<HTMLDivElement>(null);
const { items, options } = toRefs(props);

const slots = useSlots();

// Data
const popper: Ref<PopperInstance | null> = ref(null);
const { allOptions } = useOptions<TooltipOptions>(options);

// Computed
const computedFixedPositioning = computed(
  () => allOptions.value.fixedPositioning ?? props.fixedPositioning
);

const strategy = computed<PositioningStrategy>(() =>
  computedFixedPositioning.value ? 'fixed' : 'absolute'
);

const allModifiers = computed(() => [
  {
    name: 'computeStyles',
    options: {
      adaptive: false, // so that we can have smooth transitions
    },
  },
  {
    name: 'offset',
    options: { offset: [0, allOptions.value.offset || 8] },
  },
  ...(props.modifiers || []),
]);

const showTitle = computed(
  () => allOptions.value.showTitle !== false && props.title != undefined
);

const formatValue = computed(() => useFormat(allOptions.value.valueFormat));

const formatTitle = computed(() => useFormat(allOptions.value.titleFormat));

const summaryItem = computed(
  () =>
    items.value?.find((item) => item.isSummary) || {
      label: allOptions.value.summary ?? props.summary,
    }
);

const hasSummary = computed(() => slots.summary || summaryItem.value.label);

const computedItems = computed(() => {
  if (props.inverse || allOptions.value.inverse) {
    return [...items.value].reverse();
  }
  return items.value;
});

// Methods
function initPopper() {
  if (props.targetElement && root.value) {
    popper.value = createPopper(props.targetElement, root.value, {
      placement: props.position,
      strategy: strategy.value,
      modifiers: allModifiers.value,
    });
    emit('opened', props.targetElement);
  }
}

function destroyPopper() {
  if (popper.value) {
    popper.value.destroy();
    emit('closed');
    root.value.classList.remove('lume-tooltip--animated'); // Remove transition class
  }
}

function updatePopper() {
  if (!popper.value) return;

  if (allOptions.value.withAnimation !== false) {
    root.value.classList.add('lume-tooltip--animated'); // Add transition class
  }

  props.targetElement
    ? (function () {
      popper.value.state.elements.reference = props.targetElement;
      popper.value.update();
      emit('moved', props.targetElement);
    })()
    : destroyPopper();
}

// Watchers
watch(
  () => props.targetElement,
  (newValue, oldValue) => {
    if (!oldValue && newValue) initPopper();
    else updatePopper();
  }
);

// Lifecycle
onMounted(initPopper);
onBeforeUnmount(destroyPopper);
</script>

<style lang="scss" scoped>
@use './styles';
</style>
