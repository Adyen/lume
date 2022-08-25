import { Color } from '@/types/colors';
import { SankeyNode, SankeyLink } from 'd3-sankey';
import { Dataset, DatasetValueObject } from "@/types/dataset";
import { ContainerSize } from '@/types/size';

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

export type HighlightedElements = {
    node?: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>,
    link?: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>,
    links?: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>[]
}

interface AlluvialNodeTarget {
    node: string;
    value: number;
    color?: Color;
}

export interface AlluvialNode extends DatasetValueObject<string> {
    targets?: Array<AlluvialNodeTarget>
}

export interface AlluvialDataset extends Dataset<AlluvialNode> {
    nodePadding?: number;
    nodeWidth?: number;
    nodeSort?: (
        nodeA: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>,
        nodeB: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>
    ) => number;
    valueFormatter?: (value: number) => string;
    getHighlightedElements?: ({ node, link, links }: HighlightedElements) => {
        links: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>[],
        nodes: Map<unknown, unknown>
    };
    nodeAlign?: (
        node: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>,
        n: number
    ) => number
}

export type NodeBlock = {
    id?: string,
    rect?: {
        cssClass: ({ color: Color }) => string,
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
    containerSize: ContainerSize
    highlightedLink: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>,
    highlightedNode: SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>,
    leftExtent: number,
    rightExtent: number,
    topExtent: number,
    bottomExtent: number,
    nodeBlocks: Array<NodeBlock>,
    linkPaths: Array<LinkPath>
}

