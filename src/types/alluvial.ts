import { Color } from '@/types/colors';
import {SankeyNode, SankeyLink} from 'd3-sankey';

interface AlluvialNodeTarget {
    node: string;
    value: number;
    color?: Color;
}

export interface SankeyNodeAdditionalProperties {
    id: number | string,
    label: string,
    layer?: number,
    color?: Color
}

export interface SankeyLinkAdditionalProperties {
    color?: Color,
    x0?: number | undefined,
    x1?: number | undefined
}

interface Dimension {
    width: number,
    height: number
}

export interface AlluvialLink {
    source: string;
    color?: Color;
    target: string;
    value: number | string
}

export interface AlluvialNode {
    id: string;
    label: string;
    color?: Color;
    targets?: Array<AlluvialNodeTarget>
}

export type Alluvial = {
    values: Array<AlluvialNode>;
    nodePadding?: number;
    nodeWidth?: number;
    nodeSort?: (a: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>, b: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>) => number;
    valueFormatter?: (value: number) => string;
    getHighlightedElements?: ({ node, link, links }) => { links: any[], nodes: Map<unknown, unknown> };
    nodeAlign: (node: SankeyNode<{}, {}>, n: number) => number
}

export type NodeBlock = {
    id?: string,
    rect?: {
        cssClass: ({color: Color}) => string,
        width: number,
        height: number
    },
    textTransform?: { x: number, y: number },
    node?: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>
}

export type LinkPath = {
    id?: string,
    d?: string,
    color?: string,
    strokeWidth?: number,
    link?: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>
}

export type AlluvialInstance = {
    containerSize: Dimension,
    highlightedLink: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>,
    highlightedNode: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>,
    leftExtent: number,
    rightExtent: number,
    topExtent: number,
    bottomExtent: number,
    nodeBlocks: Array<NodeBlock>,
    linkPaths: Array<LinkPath>
}

