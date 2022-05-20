import { Ref, ref } from '@vue/composition-api';

export interface PopoverConfig {
  opened: boolean;
  targetElement: Element | null;
}

export function usePopover() {
  const popoverConfig: Ref<PopoverConfig> = ref({
    opened: false,
    targetElement: null,
  });

  const showPopover = (targetElement: Element | null) => {
    popoverConfig.value.opened = true;
    popoverConfig.value.targetElement = targetElement;
  };

  const hidePopover = () => {
    popoverConfig.value.opened = false;
    popoverConfig.value.targetElement = null;
  };

  return { popoverConfig, showPopover, hidePopover };
}
