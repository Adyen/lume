import { computed, reactive, Ref, set } from '@vue/composition-api';

import { getXByIndex, Scale } from './scales';

import { Orientation, ORIENTATIONS } from '@/constants';
import { getHighestValue } from '@/utils/helpers';
import { Data, DatasetValueObject } from '@/types/dataset';

export interface TooltipConfig {
  opened: boolean;
  targetElement: Element | null;
}

function getStackedHighestValue(
  data: Data<DatasetValueObject>,
  index: number
): number {
  return data.reduce((sum, curr) => {
    const val = curr.values[index]?.value;
    if (val > 0) sum += val;
    return sum;
  }, 0);
}

const ANCHOR_MAP = {
  'stacked-bar-chart': getStackedHighestValue,
};

export function useTooltipAnchors(
  data: Ref<Data<DatasetValueObject>>,
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation: Ref<Orientation>,
  chartType: Ref<string>
) {
  // TODO: Needs to account for bar chart, negative values should default to 0.
  const getTooltipAnchorAttributes = computed(() => (index: number) => {
    const highestValue = chartType.value
      ? ANCHOR_MAP[chartType.value](data.value, index)
      : getHighestValue(data.value, index);

    const cx =
      orientation.value === ORIENTATIONS.HORIZONTAL
        ? xScale.value(highestValue)
        : getXByIndex(xScale.value, index);

    const cy =
      orientation.value === ORIENTATIONS.HORIZONTAL
        ? getXByIndex(yScale.value, index)
        : yScale.value(highestValue);

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
