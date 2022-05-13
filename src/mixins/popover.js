/**
 * Provides an interface to show/hide a chart popover.
 */
export default function PopoverMixin() {
  return {
    data: () => ({
      popoverConfig: {
        opened: false,
        targetElement: null,
      },
    }),
    methods: {
      /**
       * Shows the popover at the specified target.
       * @param {HTMLElement} targetElement The element the popover should attach to.
       */
      $showPopover(targetElement) {
        this.popoverConfig = {
          opened: true,
          targetElement,
        };
      },
      /**
       * Hides the popover.
       */
      $hidePopover() {
        this.popoverConfig = {
          opened: false,
          targetElement: null,
        };
      },
    },
  };
}
