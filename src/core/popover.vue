<template>
  <div>
    <h3>This is a popover</h3>
    <slot></slot>
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
  },
  mounted() {
    this.initPopper();
  },
  beforeDestroy() {
    this.destroyPopper();
  },
  computed: {
    strategy() {
      return this.fixedPositioning ? 'fixed' : 'absolute';
    },
    allModifiers() {
      return this.modifiers || [];
    }
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
  }
}
</script>