import { Orientation, ORIENTATIONS } from '@/constants';
import { Data, DatasetValueObject } from '@/types/dataset';
import { computed, reactive, Ref, set } from '@vue/composition-api';
import { getXByIndex, Scale } from './scales';

export interface TooltipConfig {
  opened: boolean;
  targetElement: Element | null;
}

export function useTooltipAnchors(
  data: Ref<Data<DatasetValueObject>>,
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation: Ref<Orientation>
) {
  // TODO: Needs to account for null values (line chart). currently falls back to 0
  // Also, for bar chart, negative values should default to 0.
  const getTooltipAnchorAttributes = computed(() => (index: number) => {
    const highestValue = data.value.reduce((max, point) =>
      max.values[index]?.value > point.values[index]?.value ? max : point
    ).values[index]?.value;

    const cx =
      orientation.value === ORIENTATIONS.HORIZONTAL
        ? xScale.value(highestValue || 0)
        : getXByIndex(xScale.value, index);

    const cy =
      orientation.value === ORIENTATIONS.HORIZONTAL
        ? getXByIndex(yScale.value, index)
        : yScale.value(highestValue || 0);

    return {
      cx,
      cy,
    };
  });

  return { getTooltipAnchorAttributes };
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
