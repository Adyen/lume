import { reactive, set } from '@vue/composition-api';

export interface TooltipConfig {
  opened: boolean;
  targetElement: Element | null;
}

export function useTooltip() {
  const tooltipConfig = reactive<TooltipConfig>({
    opened: false,
    targetElement: null,
  });

  const showTooltip = (targetElement: Element | null) => {
    set(tooltipConfig, 'opened', true);
    set(tooltipConfig, 'targetElement', targetElement);
  };

  const hideTooltip = () => {
    set(tooltipConfig, 'opened', false);
    set(tooltipConfig, 'targetElement', null);
  };

  return { tooltipConfig, showTooltip, hideTooltip };
}
