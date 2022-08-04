<template>
  <div
    ref="root"
    class="adv-tooltip"
    data-j-tooltip
  >
    <slot>
      <!-- Default chart tooltip content -->
      <div
        v-if="title"
        class="adv-tooltip__title"
        data-j-tooltip__title
      >
        {{ title }}
      </div>
      <ul class="adv-tooltip__items">
        <li
          v-for="item in items"
          :key="item.label"
          class="adv-tooltip__item"
          data-j-tooltip__item
        >
          <span
            :class="[
              `adv-tooltip__symbol--${item.type}`,
              `adv-tooltip__symbol--color-${item.color || '01'}`,
            ]"
            class="adv-tooltip__symbol"
            data-j-tooltip__item__symbol
          />
          <span data-j-tooltip__item__label>
            {{ item.label }}
          </span>
          <strong
            class="adv-tooltip__value"
            data-j-tooltip__item__value
          >
            {{ item.value }}
          </strong>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  Ref,
  toRefs,
  watch,
} from '@vue/composition-api';
import {
  createPopper,
  Instance as PopperInstance,
  Placement,
  PositioningStrategy,
} from '@popperjs/core';

import { TooltipOptions, useOptions, withOptions } from '@/mixins/options';

interface TooltipItem {
  type: string;
  color: string;
  label: string;
  value: number | string;
}

export const positions = [
  'auto',
  'auto-start',
  'auto-end',
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
];

export default defineComponent({
  props: {
    targetElement: Element,
    position: {
      type: String as PropType<Placement>,
      default: 'auto',
      validator: (value: string) => positions.includes(value),
    },
    fixedPositioning: { type: Boolean, default: false },
    modifiers: { type: Array, default: null },
    title: { type: [String, Number], default: null },
    items: {
      type: Array as PropType<Array<TooltipItem>>,
      default: null,
    },
    ...withOptions<TooltipOptions>(),
  },
  setup(props) {
    // Refs
    const root = ref<HTMLDivElement>(null);
    const { options } = toRefs(props);

    // Data
    const popper: Ref<PopperInstance | null> = ref(null);
    const { allOptions } = useOptions<TooltipOptions>(options);

    // Computed
    const strategy = computed<PositioningStrategy>(() =>
      props.fixedPositioning ? 'fixed' : 'absolute'
    );
    const allModifiers = computed(() => [
      ...(props.modifiers || []),
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
    ]);

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

      root.value.classList.add('adv-tooltip--animated'); // Add transition class

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

    return { root, popper, strategy, allModifiers, allOptions };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
