<template>
  <div
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
              `adv-popover__symbol--color-${item.color || '01'}`
            ]"
          />
          {{ item.label }}
          <strong class="adv-popover__value">{{ item.value }}</strong>
        </li>
      </ul>
    </slot>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core';

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

/**
 * A popover data point item.
 * @typedef {object} PopoverItem
 * @property {string} type Type of data point. `line` draws a point, `bar` draws a square.
 * @property {string} color Color of the data group.
 * @property {string} label Label for the data group.
 * @property {(number|string)} value Value of the data point.
 */

export default {
  props: {
    /**
     * Reference element for positioning
     */
    targetElement: { type: Element, required: true },
    /**
     * Position relative to the target element
     * @see {@link https://popper.js.org/docs/v2/constructors/#placement}
     */
    position: { type: String, default: 'auto', validator: value => positions.includes(value) },
    /**
     * Instructs popover to be visible outside of the containing container.
     * Useful when component would be used in limited containers like Modal, Side panel, etc.
     * https://popper.js.org/docs/v2/constructors/#strategy
     */
    fixedPositioning: { type: Boolean, default: false },
    /**
     * Custom set of modifiers. Useful for low-level control over Popper behavior in some really complex use cases.
     */
    modifiers: { type: Array, default: null },
    /** 
     * The popover title. Only displayed if the default popover content is used.
     */
    title: { type: String, default: null },
    /**
     * An array of items. Only displayed if the default popover content is used.
     * @type {PopoverItem[]}
     */
    items: { type: Array, default: null },
  },
  data: () => ({
    popper: { state: {} }
  }),
  computed: {
    strategy() {
      return this.fixedPositioning ? 'fixed' : 'absolute';
    },
    allModifiers() {
      return this.modifiers || [];
    },
    arrowClass() {
      if (!this.popper.state.placement) return '';
      switch (this.popper.state.placement) {
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
    },
  },
  watch: {
    targetElement: "updatePopper"
  },
  mounted() {
    this.initPopper();
  },
  beforeDestroy() {
    this.destroyPopper();
  },
  methods: {
    initPopper() {
      this.popper = createPopper(this.targetElement, this.$el, {
        placement: this.position,
        strategy: this.strategy,
        modifiers: this.allModifiers,
      });
    },
    destroyPopper() {
      if (this.popper) {
        this.popper.destroy();
      }
    },
    updatePopper() {
      this.destroyPopper();
      if (this.targetElement && this.$el) {
        this.initPopper();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@use "~@/styles/components/popover/popover";
</style>