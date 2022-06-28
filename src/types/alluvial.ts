import { Color } from '@/types/colors';
import {ComputedRef} from "@vue/composition-api";


interface AlluvialNodeTarget {
    node: string;
    value: number;
    color?: Color;
}

export interface SankeyLink {
    color?: Color,
    index?: number,
    source?: any,
    target?: any,
    value?: number,
    width?: number,
    y0?: number,
    y1?: number,
    x0?: number,
    x1?: number
}

export interface SankeyNode {
    color?: Color,
    depth: number,
    height: number,
    id: number,
    index: number,
    label: string,
    layer: number,
    sourceLinks: Array<any>,
    targetLinks: Array<any>,
    value: number,
    y0?: number,
    y1?: number,
    x0?: number,
    x1?: number
}

export interface SankeyElements {
    links?: Array<SankeyLink>,
    nodes?: Array<SankeyNode>
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
    nodeSort?: () => Array<number>;
    valueFormatter?: (value: number) => string;
    getHighlightedElements?: ({ node, link, links }) => { links: any[], nodes: Map<unknown, unknown> };
    nodeAlign: () => number
}

export type NodeBlock = {
    id?: string,
    rect?: {
        cssClass: ({color: Color}) => string,
        width: number,
        height: number
    },
    textTransform?: { x: number, y: number },
    node?: SankeyNode
}

export type LinkPath = {
    id?: string,
    d?: Function,
    color?: string,
    strokeWidth?: number,
    link?: SankeyLink
}

export type AlluvialInstance = {
    containerSize: Dimension,
    highlightedLink: SankeyLink,
    highlightedNode: SankeyNode,
    leftExtent: number,
    rightExtent: number,
    topExtent: number,
    bottomExtent: number,
    nodeBlocks: Array<NodeBlock>,
    linkPaths: Array<LinkPath>
}

