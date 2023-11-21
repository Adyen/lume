import { computed, reactive, Ref, watch } from 'vue';

import { getXByIndex, Scale } from './scales';

import { NO_DATA, Orientation, ORIENTATIONS } from '@/utils/constants';
import { DatasetValueObject, InternalData } from '@/types/dataset';
import { ChartOptions } from './options';

export interface AnchorAttributes {
  cx: number;
  cy: number;
}

type GetHighestValuesFunction = (
  data: InternalData,
  numberOfLabels: number
) => Array<number>;

export interface TooltipConfig {
  opened: boolean;
  targetElement: Element | null;
}

function getFilledArray(
  originalArray: Array<number | DatasetValueObject>,
  numberOfLabels: number
) {
  const difference = numberOfLabels - originalArray.length;
  return difference > 0
    ? [...originalArray, ...Array(difference).fill({ value: null })]
    : originalArray;
}

function getHighestValues(data: InternalData, numberOfLabels: number) {
  return data.reduce((acc, curr) => {
    return getFilledArray(curr.values, numberOfLabels).map((value, index) => {
      if (!acc[index]) return value.value ?? 0;
      return value.value > acc[index] ? value.value : acc[index];
    });
  }, [] as Array<number>);
}

function getStackedHighestValue(data: InternalData, numberOfLabels: number) {
  return data.reduce((acc, curr) => {
    return getFilledArray(curr.values, numberOfLabels).map(
      (datasetValue, index) => {
        // Ignore null and negative values
        const value =
          datasetValue.value == null || datasetValue.value < 0
            ? 0
            : datasetValue.value;
        if (!acc[index]) return value;
        return acc[index] + value; // Instead of returning the highest value, sums them.
      }
    );
  }, [] as Array<number>);
}

const ANCHOR_CALCULATION_METHOD_MAP: {
  [type: string]: GetHighestValuesFunction;
} = {
  'stacked-bar': getStackedHighestValue,
};

export function useTooltipAnchors(
  anchorAttributeArray: Ref<Array<AnchorAttributes>>,
  options: Ref<ChartOptions>,
  xScale: Ref<Scale>,
  yScale: Ref<Scale>,
  orientation?: Ref<Orientation>,
  data?: Ref<InternalData>,
  chartType?: Ref<string>,
  labels?: Ref<Array<string>>
) {
  const shouldGenerateTooltipAnchors = computed(
    () =>
      options.value.withTooltip !== false &&
      !options.value.tooltipOptions?.targetElement
  );

  function updateTooltipAnchorAttributes(renderedData: InternalData) {
    const numberOfLabels = labels?.value?.length ?? 0;
    const highestValues =
      chartType?.value && ANCHOR_CALCULATION_METHOD_MAP[chartType.value]
        ? ANCHOR_CALCULATION_METHOD_MAP[chartType.value](
          renderedData,
          numberOfLabels
        )
        : getHighestValues(renderedData, numberOfLabels);

    anchorAttributeArray.value = highestValues.map((value, index) => ({
      cx:
        orientation?.value === ORIENTATIONS.HORIZONTAL
          ? xScale.value(value)
          : getXByIndex(xScale.value, index),
      cy:
        orientation?.value === ORIENTATIONS.HORIZONTAL
          ? getXByIndex(yScale.value, index)
          : yScale.value(value),
    }));
  }

  watch(
    [xScale, yScale],
    () => {
      if (
        xScale.value &&
        yScale.value &&
        data?.value &&
        shouldGenerateTooltipAnchors.value
      ) {
        updateTooltipAnchorAttributes(data.value);
      }
    },
    { immediate: true }
  );

  return { shouldGenerateTooltipAnchors, updateTooltipAnchorAttributes };
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

export function useTooltipItems(data: Ref<InternalData>) {
  const getTooltipItems = computed(
    () => (index: number) =>
      data.value.map(({ color, label, values }) => ({
        color: values[index]?.color || color,
        label,
        value: values[index]?.label ?? values[index]?.value ?? NO_DATA,
      }))
  );

  return { getTooltipItems };
}
