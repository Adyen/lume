import { computed, isRef, PropType, Ref } from 'vue';

import { Margins, TOOLTIP_POSITIONS } from '@/constants';
import { mergeDeep } from '@/utils/helpers';
import { ColorPalette } from '@/types/dataset';

export interface AxisOptions extends Options {
  gridLines?: boolean;
  withTitle?: boolean;
  title?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickFormat?: string | (() => string);
  tickPadding?: number;
  skip?: true | number; // `true` will enable auto-skip, number will be used as amount of ticks to skip
}

export interface TooltipOptions extends Options {
  offset?: number;
  position?: typeof TOOLTIP_POSITIONS[number];
  showTitle?: boolean;
  targetElement?: Element | 'self';
  fixedPositioning?: boolean;
}

type LegendPosition = 'top' | 'bottom';

export interface ChartOptions extends Options {
  margins?: Margins;
  xAxisOptions?: AxisOptions;
  yAxisOptions?: AxisOptions;
  tooltipOptions?: TooltipOptions;
  colorPalette?: ColorPalette;
  startOnZero?: boolean;
  withHover?: boolean;
  withTooltip?: boolean;
  withLegend?: boolean;
  legendPosition?: LegendPosition;
  withTransition?: boolean;
  noBaseScales?: boolean;
  noMinSize?: boolean;
  transparentBackground?: boolean;
}

export interface BarChartOptions extends ChartOptions {
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
}

export interface LineChartOptions extends ChartOptions {
  lineWidth?: number;
}

export type Options = Record<string, unknown>;

export const withOptions = <T = Options>() => ({
  options: {
    type: Object as PropType<T>,
    default: () => ({}),
  },
});

export function useOptions<T extends Options = Options>(
  options: Ref<T>,
  defaultOptions?: T | Ref<T>
) {
  const allOptions = computed<T>(() => {
    const defaults = isRef(defaultOptions)
      ? defaultOptions?.value
      : defaultOptions;
    return defaults ? (mergeDeep(defaults, options.value) as T) : options.value;
  });

  return { allOptions };
}
