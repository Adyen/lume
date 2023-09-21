import { SankeyNode } from 'd3-sankey';

import { SankeyLink, SankeyLinkProps, SankeyNodeProps } from './alluvial';
import { Data, DatasetValueObject, InternalDataset } from './dataset';
import { ContainerSize } from './size';

export interface AlluvialNodeEventPayload {
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>;
  event: MouseEvent | PointerEvent;
}
export interface AlluvialLinkEventPayload {
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>;
  event: MouseEvent | PointerEvent;
}

export interface DataChangedEventPayload<T> {
  newValue: T;
  oldValue: T | null;
}

export interface InteractionEventPayload {
  index: number | null;
  value?: number | string;
  datasetIndex?: number;
  event?: MouseEvent | PointerEvent;
}

export interface LegendEventPayload {
  index: number;
  dataset: InternalDataset<DatasetValueObject>;
  event: MouseEvent | PointerEvent;
}

export interface TooltipEventPayload {
  index: number;
  targetElement: Element | null;
}

export interface AxisEvents {
  (e: 'axis-click', p: InteractionEventPayload): void;
  (e: 'axis-mouseenter', p: InteractionEventPayload): void;
  (e: 'axis-mouseleave'): void;
}

export interface AlluvialDiagramEvents {
  (e: 'node-click', p: AlluvialNodeEventPayload): void;
  (e: 'node-mouseenter', p: AlluvialNodeEventPayload): void;
  (e: 'node-mouseleave', p: AlluvialNodeEventPayload): void;

  (e: 'link-click', p: AlluvialLinkEventPayload): void;
  (e: 'link-mouseenter', p: AlluvialLinkEventPayload): void;
  (e: 'link-mouseleave', p: AlluvialLinkEventPayload): void;
}

export interface BarChartEvents {
  (e: 'bar-click', p: InteractionEventPayload): void;
}

export interface ChartEvents {
  (e: 'rendered'): void;
  (e: 'resize', p: ContainerSize): void;

  (e: 'data-changed', p: DataChangedEventPayload<Data>): void;
  (e: 'labels-changed', p: DataChangedEventPayload<Array<string>>): void;

  (e: 'chart-click', p: PointerEvent): void;
  (e: 'chart-mouseenter', p: MouseEvent): void;
  (e: 'chart-mouseleave'): void;
}

export interface LegendEvents {
  (e: 'legend-click', p: LegendEventPayload): void;
  (e: 'legend-mouseenter', p: LegendEventPayload): void;
  (e: 'legend-mouseleave'): void;
}

export interface LineChartEvents {
  (e: 'line-click', p: InteractionEventPayload): void;
  (e: 'point-click', p: InteractionEventPayload): void;
}

export interface TooltipEvents {
  (e: 'tooltip-opened', p: TooltipEventPayload): void;
  (e: 'tooltip-moved', p: TooltipEventPayload): void;
  (e: 'tooltip-closed'): void;
  (e: 'tooltip-mouseenter'): void;
  (e: 'tooltip-mouseleave'): void;
}

export type ChartEmits = AxisEvents &
  AlluvialDiagramEvents &
  BarChartEvents &
  ChartEvents &
  LegendEvents &
  LineChartEvents &
  TooltipEvents;
