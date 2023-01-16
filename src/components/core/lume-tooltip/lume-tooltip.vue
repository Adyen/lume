<template>
  <div
    ref="root"
    class="lume-tooltip lume-typography--caption"
    data-j-tooltip
  >
    <slot>
      <!-- Default chart tooltip content -->
      <div
        v-if="showTitle"
        class="lume-tooltip__title"
        data-j-tooltip__title
      >
        {{ title }}
      </div>
      <ul class="lume-tooltip__items">
        <template v-if="summaryItem.label">
          <li
            class="lume-tooltip__item"
            data-j-tooltip__summary-item
          >
            <span> {{ summaryItem.label }} </span>
            <strong
              v-if="summaryItem.value"
              class="lume-tooltip__value"
            >
              {{ formatValue(summaryItem.value) }}
            </strong>
          </li>
          <li class="lume-tooltip__break">
            <hr>
          </li>
        </template>
        <li
          v-for="item in items"
          :key="item.label"
          class="lume-tooltip__item"
          data-j-tooltip__item
        >
          <span
            :class="[`lume-background-color--${item.color}`]"
            class="lume-tooltip__symbol"
            data-j-tooltip__item__symbol
          />
          <span data-j-tooltip__item__label>
            {{ item.label }}
          </span>
          <strong
            class="lume-tooltip__value"
            data-j-tooltip__item__value
          >
            {{ formatValue(item.value) }}
          </strong>
        </li>
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
  watch,
} from 'vue';
import {
  createPopper,
  Placement,
  Instance as PopperInstance,
  PositioningStrategy,
} from '@popperjs/core';

import { useFormat } from '@/composables/format';
import { TooltipOptions, useOptions, withOptions } from '@/composables/options';

import { TOOLTIP_POSITIONS } from '@/constants';

const props = defineProps({
  targetElement: {
    type: Element,
    required: true,
  },
  items: {
    type: Array as PropType<Array<TooltipItem>>,
    required: true,
  },
  position: {
    type: String as PropType<Placement>,
    default: 'auto',
    validator: (value: string) =>
      TOOLTIP_POSITIONS.includes(value as typeof TOOLTIP_POSITIONS[number]),
  },
  fixedPositioning: {
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

// Refs
const root = ref<HTMLDivElement>(null);
const { items, options } = toRefs(props);

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

const summaryItem = computed(
  () =>
    items.value?.find((item) => item.isSummary) || {
      label: allOptions.value.summary ?? props.summary,
    }
);

// Methods
function initPopper() {
  if (props.targetElement && root.value) {
    popper.value = createPopper(props.targetElement, root.value, {
      placement: props.position,
      strategy: strategy.value,
      modifiers: allModifiers.value,
    });
  }
}

function destroyPopper() {
  if (popper.value) {
    popper.value.destroy();
  }
}

function updatePopper() {
  if (!popper.value) return;

  root.value.classList.add('lume-tooltip--animated'); // Add transition class

  props.targetElement
    ? (function () {
      popper.value.state.elements.reference = props.targetElement;
      popper.value.update();
    })()
    : destroyPopper();
}

// Watchers
watch(() => props.targetElement, updatePopper);

// Lifecycle
onMounted(initPopper);
onBeforeUnmount(destroyPopper);
</script>

<style lang="scss" scoped>
@use './styles';
</style>
