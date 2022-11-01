<template>
  <div
    ref="root"
    class="lume-tooltip"
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
        <li
          v-for="item in items"
          :key="item.label"
          class="lume-tooltip__item"
          data-j-tooltip__item
        >
          <span
            :class="[
              `lume-tooltip__symbol--${item.type}`,
              `lume-background-color--${item.color || '01'}`,
            ]"
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
} from 'vue';
import {
  createPopper,
  Placement,
  Instance as PopperInstance,
  PositioningStrategy,
} from '@popperjs/core';

import { TooltipOptions, useOptions, withOptions } from '@/composables/options';

import { TOOLTIP_POSITIONS } from '@/constants';

interface TooltipItem {
  type: string;
  color: string;
  label: string;
  value: number | string;
}

export default defineComponent({
  props: {
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

    return { allModifiers, allOptions, popper, root, showTitle, strategy };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
