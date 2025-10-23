import type {
  GetHighlightedElementsFunction,
  SankeyLink,
  SankeyLinkProps,
  SankeyNodeProps,
} from './alluvial';
import type { ColorPalette } from './dataset';
import type { SankeyNode } from 'd3-sankey';

import type { Format } from '../composables/format';
import type { Margins } from './utils';

import { TOOLTIP_POSITIONS } from '../utils/constants';

export interface AxisOptions extends Options {
  gridLines?: boolean;
  withTitle?: boolean;
  title?: string;
  showTicks?: boolean;
  tickCount?: number;
  tickFormat?: Format;
  tickPadding?: number;
  skip?: true | number; // `true` will enable auto-skip, number will be used as amount of ticks to skip
}

export interface TooltipOptions extends Options {
  fixedPositioning?: boolean;
  inverse?: boolean;
  offset?: number;
  position?: (typeof TOOLTIP_POSITIONS)[number];
  showTitle?: boolean;
  summary?: string;
  targetElement?: Element | 'self';
  titleFormat?: Format;
  valueFormat?: Format;
  withAnimation?: boolean;
  withPointerEvents?: boolean;
}

type LegendPosition = 'top' | 'bottom';

export interface ChartOptions extends Options {
  margins?: Margins;
  xAxisOptions?: AxisOptions;
  yAxisOptions?: AxisOptions;
  tooltipOptions?: TooltipOptions;
  colorPalette?: ColorPalette;
  startOnZero?: boolean;
  withAxes?: boolean;
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
  barHeight?: number;
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
}

export interface LineChartOptions extends ChartOptions {
  lineWidth?: number;
  withPoints?: boolean | 'visible';
}

export interface AlluvialDiagramOptions extends ChartOptions {
  gradient?: boolean;
  highlightedElements?: 'full' | 'closest' | GetHighlightedElementsFunction;
  nodeAlign?: (node: SankeyNode<unknown, unknown>, n: number) => number;
  nodeHeaders?: Array<string>;
  nodeHeaderPadding?: number;
  nodeLabelMaxWidth?: number;
  nodePadding?: number;
  nodeSort?: (
    a: SankeyNode<unknown, unknown>,
    b: SankeyNode<unknown, unknown>
  ) => number | undefined | null;
  nodeWidth?: number;
  linkSort?: (
    a: SankeyLink<SankeyNodeProps, SankeyLinkProps>,
    b: SankeyLink<SankeyNodeProps, SankeyLinkProps>
  ) => number | undefined | null;
  iterations?: number;
  switchText?: boolean;
  valueFormat?: Format;
}

export type Options = Record<string, unknown>;
