import {
  SankeyExtraProperties,
  SankeyGraph,
  SankeyLink,
  SankeyNode,
} from 'd3-sankey';

import { Color } from '@/constants';
import { Dataset, DatasetValueObject } from '@/types/dataset';

interface AlluvialNodeTarget {
  node: string;
  value: number;
  color?: Color;
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
}

export interface HighlightedElements {
  nodes: { [id: string]: string | number };
  links: Array<string>;
}

export type GetHighlightedElementsFunction = (
  element:
    | SankeyNode<SankeyNodeProps, SankeyLinkProps>
    | SankeyLink<SankeyNodeProps, SankeyLinkProps>,
  graph?: SankeyGraph<SankeyNodeProps, SankeyLinkProps>
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
