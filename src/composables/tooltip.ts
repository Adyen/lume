import { computed, reactive, Ref } from 'vue';

import { getXByIndex, Scale } from './scales';

import { NO_DATA, Orientation, ORIENTATIONS } from '@/constants';
import { getHighestValue } from '@/utils/helpers';
import { Data, DatasetValueObject, InternalData } from '@/types/dataset';

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

const ANCHOR_CALCULATION_METHOD_MAP = {
  'stacked-bar': getStackedHighestValue,
};

export function useTooltipAnchors(
  data: Ref<InternalData>,
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation: Ref<Orientation>,
  chartType?: Ref<string>
) {
  // TODO: Needs to account for bar chart, negative values should default to 0.
  const getTooltipAnchorAttributes = computed(() => (index: number) => {
    let highestValue =
      chartType.value && ANCHOR_CALCULATION_METHOD_MAP[chartType.value]
        ? ANCHOR_CALCULATION_METHOD_MAP[chartType.value](data.value, index)
        : getHighestValue(data.value, index);

    // Negative bar anchor point should always be at 0 level
    if (chartType?.value?.includes('bar') && highestValue < 0) {
      highestValue = 0;
    }

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

  function getTooltipItems(index: number) {
    return data.value.map(({ color, label, values }) => ({
      color: values[index]?.color || color,
      label,
      value: values[index]?.label ?? values[index]?.value ?? NO_DATA,
    }));
  }

  return { getTooltipAnchorAttributes, getTooltipItems };
}

export function useTooltip() {
  const tooltipConfig = reactive<TooltipConfig>({
    opened: false,
    targetElement: null,
  });

  const showTooltip = (targetElement: Element | null) => {
    tooltipConfig.opened = true;
    tooltipConfig.targetElement = targetElement;
  };

  const hideTooltip = () => {
    tooltipConfig.opened = false;
    tooltipConfig.targetElement = null;
  };

  return { tooltipConfig, showTooltip, hideTooltip };
}
