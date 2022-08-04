import { computed, ComputedRef, onMounted, onBeforeUnmount, ref, Ref } from '@vue/composition-api';
import {
    Alluvial,
    AlluvialInstance,
    NodeBlock, SankeyLinkAdditionalProperties, SankeyNodeAdditionalProperties,
} from "@/types/alluvial";
import { select } from 'd3-selection';
import {SankeyGraph, SankeyLink, sankeyLinkHorizontal, SankeyNode} from 'd3-sankey';
import { defaultChartColor, nodeToLabelGap, transitionDuration } from "@/charts/alluvial-chart/defaults";

export function drawPlot(
    alluvialInstance: Ref<AlluvialInstance>,
    alluvialProps: Ref<Alluvial>,
    chartContainer: Ref<HTMLElement>,
    nodeId: (node: (string | number | SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>)) => string | number,
    graph: Ref<SankeyGraph<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>>,
) {

    const drawingBoard = ref(null);
    const nodeIdRef = ref(nodeId);
    let isBeingDestroyed = false;

    onMounted(() => {
        drawingBoard.value = select(chartContainer.value);
    });

    onBeforeUnmount(() => {
        isBeingDestroyed = true;
    })

    function nodeMaxLength({label, value}): number {
        return Math.max(label.length, alluvialProps.value.valueFormatter(value).length);
    }

    function byMaxNodeLength(nodeA, nodeB): number {
        return nodeMaxLength(nodeB) - nodeMaxLength(nodeA);
    }

    function getNodeLabelBBoxByNodeId(node): SVGRect {
        return drawingBoard.value?.select(`#node-block-${nodeIdRef.value?.(node)} .node__label`)?.node()?.getBBox()
    }

    const leftMostNodeLabelWidth: ComputedRef<number> = computed(() => {
        const longestFirstLevelNode = graph.value.nodes?.filter(({depth}) => depth === 0)
            .sort(byMaxNodeLength)?.[0];
        if (longestFirstLevelNode == null) return 0;
        return getNodeLabelBBoxByNodeId(longestFirstLevelNode)?.width ?? 0;
    });

    const maxDepth = computed(() => {
        return Math.max(...graph.value.nodes.map(({depth}) => depth));
    });

    const rightMostNodeLabelWidth = computed(() => {
        const maxX1 = getNodesMaximum('x1');
        const longestLastLevelNode = graph.value.nodes?.filter(({x1}) => x1 === maxX1)
            .sort(byMaxNodeLength)?.[0];
        if (longestLastLevelNode == null) return 0;
        return getNodeLabelBBoxByNodeId(longestLastLevelNode)?.width ?? 0;
    });

    const topMostNodeLabelExtraHeight = computed(() => {
        const minY0 = graph.value?.nodes?.reduce((acc, {y0}) => Math.min(acc, y0), Infinity);
        const highestLabelNode = graph.value?.nodes?.find(({y0}) => y0 === minY0);
        if (highestLabelNode == null) return 0;
        return Math.abs(getNodeLabelBBoxByNodeId(highestLabelNode)?.y ?? 0);
    });

    const bottomMostNodeLabelExtraHeight = computed(() => {
        const maxY1 = getNodesMaximum('y1');
        const lowestLabelNode = graph.value?.nodes?.find(({y1}) => y1 === maxY1);
        if (lowestLabelNode == null) return 0;
        return Math.abs(getNodeLabelBBoxByNodeId(lowestLabelNode)?.y ?? 0);
    });

    const highlightedElements: ComputedRef<{ links?: any[], nodes?: Map<unknown, unknown> }> = computed(() => {
        if (alluvialInstance.value.highlightedLink === null && alluvialInstance.value.highlightedNode === null) return {};
        if (alluvialProps.value.getHighlightedElements) {
            return alluvialProps.value.getHighlightedElements({
                link: alluvialInstance.value.highlightedLink,
                node: alluvialInstance.value.highlightedNode,
                links: graph.value.links,
            });
        }
        if (alluvialInstance.value.highlightedNode) {
            const links = [...alluvialInstance.value.highlightedNode.sourceLinks, ...alluvialInstance.value.highlightedNode.targetLinks];
            return {
                links,
                nodes: new Map(
                    links
                        .reduce((acc, {source, target, value}) => {
                            if (source === alluvialInstance.value.highlightedNode) {
                                return [...acc, [nodeIdRef.value(target), value]];
                            }
                            return [...acc, [nodeIdRef.value(source), value]];
                        }, [])
                ),
            };
        }
        return {
            links: [alluvialInstance.value.highlightedLink],
            nodes: new Map([[nodeIdRef.value(alluvialInstance.value.highlightedLink.target), alluvialInstance.value.highlightedLink.value]]),
        };
    });

    function getIdentifier(element: number | string | SankeyNode<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>): number | string {
        if (typeof element === 'string' || typeof element === 'number') return element;
        else return element?.id;
    }

    function highlightLinks(highlightedLinks: SankeyLink<SankeyNodeAdditionalProperties, SankeyLinkAdditionalProperties>[] = graph.value.links, isEntering: boolean = false) {
        const links = highlightedLinks
            .map(_ => `#link_${getIdentifier(_.source)}\\:${getIdentifier(_.target)}`)
            .reduce((acc, linkId) => `${acc}, ${linkId}`, null);
        const nodes = highlightedLinks
            .reduce((acc, {source, target}) => [...acc, `#node-block-${getIdentifier(source)}`, `#node-block-${getIdentifier(target)}`], [])
            .reduce((acc, nodeId) => `${acc}, ${nodeId}`, null);
        drawingBoard.value?.selectAll('.path-group path')
            .filter(`:not(${links})`)
            .classed('path-group__link--out', isEntering);
        drawingBoard.value?.selectAll('.node')
            .filter(`:not(${nodes})`)
            .classed('node--out', isEntering);
    }

    function getNodesMaximum(coordinate: string) {
        return graph.value?.nodes?.reduce((acc, currentNode) => Math.max(acc, currentNode[coordinate]), -Infinity);
    }

    /**
     * Generates an interpolator from `start` to `end`, this is equivalent to d3-interpolate interpolateRound function.
     * @param start {number}
     * @param end {number}
     * @todo Use interpolateRound if we ever add d3-interpolate to the modules
     */
    function interpolateRound(start: number, end: number) {
        return t => Math.round(start * (1 - t) + end * t);
    }

    function updateNode(id: number | string, currentNumber: number, targetNumber: number) {
        const startTime = Date.now();
        const node = drawingBoard.value?.selectAll(`.node[id="node-block-${id}"] tspan.node__label__value`);
        const interpolator = interpolateRound(currentNumber, targetNumber);

        const performNextUpdate = () => {
            if (isBeingDestroyed) return;
            const now = Date.now();
            let iteration = (now - startTime) / transitionDuration;
            if (iteration > 1) {
                iteration = 1;
            }
            node.text(alluvialProps.value.valueFormatter(interpolator(iteration)));
            if (iteration < 1) {
                requestAnimationFrame(performNextUpdate);
            }
        };
        requestAnimationFrame(performNextUpdate);
    }

    function updateNodes({
                             values,
                             updatingNodes = [],
                             isEntering = false,
                         }) {
        const nodes = new Set(updatingNodes);
        const getStartNumber = node => {
            if (isEntering) return node.value;
            return values.get(nodeIdRef.value(node));
        };
        const getEndNumber = node => {
            if (isEntering) return values.get(nodeIdRef.value(node));
            return node.value;
        };
        graph.value.nodes.filter(node => nodes.has(node))
            .forEach(node => {
                updateNode(nodeIdRef.value(node), getStartNumber(node), getEndNumber(node));
            });
    }

    function computeLinkPaths(links) {
        const pathDirection = sankeyLinkHorizontal();
        return links.map(link => ({
            id: `link_${nodeIdRef.value(link.source)}:${nodeIdRef.value(link.target)}`,
            d: pathDirection(link),
            color: link.color || link.source?.color || defaultChartColor,
            strokeWidth: Math.max(1, link.width),
            link
        }));
    }

    function computeNodeBlocks(nodes): Array<NodeBlock> {
        return nodes.map(node => ({
            id: `node-block-${nodeIdRef.value(node)}`,
            rect: {
                cssClass: ({color = defaultChartColor}) => `node__block--${color}`,
                width: node.x1 - node.x0,
                height: node.y1 - node.y0
            },
            textTransform: {
                x: node.depth > 0 ? node.x1 + nodeToLabelGap : node.x0 - nodeToLabelGap,
                y: (node.y1 + node.y0) / 2
            },
            node
        }));
    }

    function renderChart({nodes, links}) {
        if (nodes == null || links == null) {
            return;
        }
        alluvialInstance.value.nodeBlocks = computeNodeBlocks(nodes);
        alluvialInstance.value.linkPaths = computeLinkPaths(links);
    }

    return {
        leftMostNodeLabelWidth,
        rightMostNodeLabelWidth,
        topMostNodeLabelExtraHeight,
        bottomMostNodeLabelExtraHeight,
        highlightedElements,
        highlightLinks,
        updateNodes,
        renderChart,
        maxDepth
    };
}