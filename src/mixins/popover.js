export default function PopoverMixin() {
  return {
    data: () => ({
      popoverConfig: {
        opened: false,
        targetElement: null,
      },
    }),
    methods: {
      $showPopover(targetElement) {
        this.popoverConfig = {
          opened: true,
          targetElement,
        };
      },
      $hidePopover() {
        this.popoverConfig = {
          opened: false,
          targetElement: null,
        };
      },
    },
  };
}
