import { CurveFactory } from 'd3';
import {
  SankeyGraph as D3SankeyGraph,
  SankeyLink as D3SankeyLink,
  SankeyExtraProperties,
  SankeyNode,
} from 'd3-sankey';

import { Color } from '@/utils/constants';
import { Dataset, DatasetValueObject } from '@/types/dataset';

interface AlluvialNodeTarget {
  node: string;
  value: number;
  color?: Color;
  curveFunction?: CurveFactory;
}

export interface AlluvialNode extends DatasetValueObject {
  targets?: Array<AlluvialNodeTarget>;
}
export interface SankeyNodeProps extends SankeyExtraProperties {
  id: number | string;
  label: string;
  color: Color;
  transitionValue?: number;
}

export interface SankeyLinkProps extends SankeyExtraProperties {
  color?: Color;
  x0?: number | undefined;
  x1?: number | undefined;
  curveFunction?: CurveFactory;
}

export interface SankeyLink<
  N extends SankeyNodeProps = SankeyNodeProps,
  L extends SankeyLinkProps = SankeyLinkProps
> extends D3SankeyLink<SankeyNodeProps, SankeyLinkProps> {
  source: SankeyNode<N, L>;
  target: SankeyNode<N, L>;
}

export interface SankeyGraph<
  N extends SankeyNodeProps = SankeyNodeProps,
  L extends SankeyLinkProps = SankeyLinkProps
> extends D3SankeyGraph<SankeyNodeProps, SankeyLinkProps> {
  links: Array<SankeyLink<N, L>>;
}

export interface HighlightedElements {
  nodes: { [id: string]: string | number };
  links: Array<string>;
}

export type GetHighlightedElementsFunction = (
  element:
    | SankeyNode<SankeyNodeProps, SankeyLinkProps>
    | SankeyLink<SankeyNodeProps, SankeyLinkProps>,
  graph: SankeyGraph<SankeyNodeProps, SankeyLinkProps>
) => HighlightedElements;

export type AlluvialDataset = Dataset<AlluvialNode>;

export type NodeBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
  textTransform: { x: number; y: number };
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>;
};

export type LinkPath = {
  id: string;
  color: string;
  d: string;
  strokeWidth: number;
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>;
};

export interface AlluvialExtents {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface AlluvialLabelMargins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
