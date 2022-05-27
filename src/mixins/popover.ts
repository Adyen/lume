import { reactive, set } from '@vue/composition-api';

export interface PopoverConfig {
  opened: boolean;
  targetElement: Element | null;
}

export function usePopover() {
  const popoverConfig = reactive<PopoverConfig>({
    opened: false,
    targetElement: null,
  });

  const showPopover = (targetElement: Element | null) => {
    set(popoverConfig, 'opened', true);
    set(popoverConfig, 'targetElement', targetElement);
  };

  const hidePopover = () => {
    set(popoverConfig, 'opened', false);
    set(popoverConfig, 'targetElement', null);
  };

  return { popoverConfig, showPopover, hidePopover };
}
