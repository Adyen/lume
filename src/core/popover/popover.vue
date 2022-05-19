<template>
  <div
    ref="root"
    class="adv-popover"
    :class="arrowClass"
  >
    <slot>
      <!-- Default chart popover content -->
      <div
        v-if="title"
        class="adv-popover__title"
      >
        {{ title }}
      </div>
      <ul class="adv-popover__items">
        <li
          v-for="item in items"
          :key="item.label"
          class="adv-popover__item"
        >
          <span
            class="adv-popover__symbol"
            :class="[
              `adv-popover__symbol--${item.type}`,
              `adv-popover__symbol--color-${item.color || '01'}`,
            ]"
          />
          {{ item.label }}
          <strong class="adv-popover__value">{{ item.value }}</strong>
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
  watch,
} from '@vue/composition-api';
import {
  createPopper,
  Instance as PopperInstance,
  Placement,
  PositioningStrategy,
} from '@popperjs/core';

interface PopoverItem {
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
    title: { type: String, default: null },
    items: {
      type: Array as PropType<Array<PopoverItem>>,
      default: null,
    },
  },
  setup(props) {
    // Refs
    const root = ref(null);

    // Data
    const popper: Ref<PopperInstance | null> = ref(null);

    // Computed
    const strategy = computed<PositioningStrategy>(() =>
      props.fixedPositioning ? 'fixed' : 'absolute'
    );
    const allModifiers = computed(() => props.modifiers || []);
    const arrowClass = computed(() => {
      if (!popper.value?.state.placement) return '';
      switch (popper.value?.state.placement) {
      case 'top':
      default:
        return 'adv-popover--arrow-bottom';
      case 'bottom':
        return 'adv-popover--arrow-top';
      case 'left':
        return 'adv-popover--arrow-right';
      case 'right':
        return 'adv-popover--arrow-left';
      }
    });

    // Methods
    function initPopper() {
      if (props.targetElement && root) {
        popper.value = createPopper(props.targetElement, root.value, {
          placement: props.position,
          strategy: strategy.value,
          modifiers: allModifiers.value,
        });
      }
    }
    function destroyPopper() {
      if (popper) {
        popper.value.destroy();
      }
    }
    function updatePopper() {
      destroyPopper();
      if (props.targetElement && root) {
        initPopper();
      }
    }

    // Watchers
    watch(() => props.targetElement, updatePopper);

    // Lifecycle
    onMounted(initPopper);
    onBeforeUnmount(destroyPopper);

    return { root, popper, strategy, allModifiers, arrowClass };
  },
});
</script>

<style lang="scss" scoped>
@use '~@/styles/components/popover/popover';
</style>
