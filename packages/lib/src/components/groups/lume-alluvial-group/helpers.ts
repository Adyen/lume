import { link as d3Link } from 'd3';
import { sankeyLinkHorizontal, SankeyNode } from 'd3-sankey';

import { DEFAULT_COLOR } from '@/utils/colors';
import { interpolateRound } from '@/utils/helpers';

import { NODE_LABEL_PADDING, NODE_MINIMUM_HEIGHT } from './constants';

import type {
  LinkPath,
  NodeBlock,
  SankeyGraph,
  SankeyLink,
  SankeyLinkProps,
  SankeyNodeProps,
} from '@/types/alluvial';
import type { AlluvialDiagramOptions } from '@/types/options';

const TRANSITION_DURATION = 200;

/**
 * Gets the ID of an alluvial node.
 * @param node An alluvial node.
 * @returns The node ID.
 */
export function getAlluvialNodeId(
  node: string | number | SankeyNode<SankeyNodeProps, SankeyLinkProps>
): number | string {
  if (typeof node === 'string' || typeof node === 'number') return node;
  return node.id ?? node.label;
}

export function getNodeById(id: number | string, graph: SankeyGraph) {
  return graph.nodes.find((node) => node.id === id);
}

export function getLinkById(id: string, graph: SankeyGraph) {
  return graph.links.find((link) => link.id === id);
}

export function isSankeyNode(
  element: SankeyNode<SankeyNodeProps, unknown> | SankeyLink
): element is SankeyNode<SankeyNodeProps, unknown> {
  return Boolean(
    (element as SankeyNode<unknown, unknown>).sourceLinks &&
      (element as SankeyNode<unknown, unknown>).targetLinks
  );
}

/**
 * Gets the layer (column index) of the diagram's last node column.
 *
 * @param nodes The graph nodes.
 * @returns The last layer index.
 */
export function getLastNodeLayer(
  nodes: Array<SankeyNode<SankeyNodeProps, SankeyLinkProps>>
) {
  return Math.max(
    ...nodes
      .filter((node) => node.parentNodeId == null) // Sub-nodes sit between columns
      .map(({ layer }) => layer)
  );
}

function isFirstColumnNode(node: SankeyNode<SankeyNodeProps, SankeyLinkProps>) {
  return node.layer === 0;
}

function isLastColumnNode(
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>,
  lastNodeLayer: number
) {
  return node.parentNodeId == null && node.layer === lastNodeLayer;
}

/**
 * Whether a node's label is rendered before (to the left of) its block. Only
 * the first and last columns are configurable; all others are rendered after.
 *
 * @param node A sankey node.
 * @param options The chart options, holding the configured label alignments.
 * @param lastNodeLayer The layer of the diagram's last node column.
 * @returns `true` if the label should be rendered to the left of the node.
 */
export function isNodeLabelBeforeNode(
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>,
  options: AlluvialDiagramOptions,
  lastNodeLayer: number
) {
  if (isFirstColumnNode(node)) return options.alignFirstNodeLabels !== 'right';
  if (isLastColumnNode(node, lastNodeLayer))
    return options.alignLastNodeLabels === 'left';
  return false;
}

export function getLabelSizes(
  graph: SankeyGraph<SankeyNodeProps, SankeyLinkProps>,
  nodeTextElements: Array<SVGTextElement>,
  options: AlluvialDiagramOptions
) {
  if (!nodeTextElements) return;

  const lastNodeLayer = getLastNodeLayer(graph.nodes);

  const startNodeIDs = graph.nodes
    .filter((node) => isFirstColumnNode(node))
    .map((n) => `${n.id}`);
  const endNodeIDs = graph.nodes
    .filter((node) => isLastColumnNode(node, lastNodeLayer))
    .map((n) => `${n.id}`);

  const maxStartNodeWidth = nodeTextElements
    .filter((textElement) => startNodeIDs.includes(textElement.dataset.id))
    .reduce(
      (acc, element) => Math.max(acc, element.getBBox().width),
      -Infinity
    );
  const maxEndNodeWidth = nodeTextElements
    .filter((textElement) => endNodeIDs.includes(textElement.dataset.id))
    .reduce(
      (acc, element) => Math.max(acc, element.getBBox().width),
      -Infinity
    );

  // Labels rendered towards the inside of the diagram are drawn over the links, so they don't need a margin
  return {
    left: options.alignFirstNodeLabels === 'right' ? 0 : maxStartNodeWidth,
    top: 0,
    right: options.alignLastNodeLabels === 'left' ? 0 : maxEndNodeWidth,
    bottom: 0,
  };
}

export function getNodeBlockAttributes(
  nodes: Array<SankeyNode<SankeyNodeProps, SankeyLinkProps>>,
  options: AlluvialDiagramOptions
): Array<NodeBlock> {
  const lastNodeLayer = getLastNodeLayer(nodes);

  return nodes.map((node) => {
    const isMinimumHeight = node.y1 - node.y0 < NODE_MINIMUM_HEIGHT;
    return {
      x: node.x0,
      y: node.y0 - (isMinimumHeight ? NODE_MINIMUM_HEIGHT / 2 : 0), // Negative offset to account for the min. height
      width: node.x1 - node.x0,
      height: isMinimumHeight ? NODE_MINIMUM_HEIGHT : node.y1 - node.y0,
      textTransform: {
        x: isNodeLabelBeforeNode(node, options, lastNodeLayer)
          ? node.x0 - NODE_LABEL_PADDING
          : node.x1 + NODE_LABEL_PADDING,
        y: (node.y1 + node.y0) / 2,
      },
      node,
    };
  });
}

function horizontalSource(link: SankeyLink): [number, number] {
  return [link.source.x1, link.y0];
}

function horizontalTarget(link: SankeyLink): [number, number] {
  return [link.target.x0, link.y1];
}

function getCurveFunction(link: SankeyLink) {
  if (!link.curveFunction) return sankeyLinkHorizontal();
  return d3Link<SankeyLink, [number, number]>(link.curveFunction)
    .source(horizontalSource)
    .target(horizontalTarget);
}

export function getLinkPathAttributes(
  links: Array<SankeyLink>
): Array<LinkPath> {
  return links.map((link) => ({
    id: link.id,
    color:
      link.color ||
      (link.source as SankeyNode<SankeyNodeProps, SankeyLinkProps>)?.color ||
      DEFAULT_COLOR,
    d: getCurveFunction(link)(link),
    strokeWidth: Math.max(1, link.width),
    link,
  }));
}

/**
 * Updates the display value of a node.
 *
 * @param nodeBlock A NodeBlock object of the node to update.
 * @param fromValue The initial node value.
 * @param toValue The target node value.
 * @param withTransition Whether to have an animated value transition or not.
 * @param reset Whether the update is for a granular value or if it's resetting to the base value.
 */
export function updateNode(
  nodeBlock: NodeBlock,
  fromValue: number,
  toValue: number,
  withTransition?: boolean,
  reset?: true
) {
  if (withTransition === false) {
    nodeBlock.node = {
      ...nodeBlock.node,
      transitionValue: reset ? undefined : toValue,
    };
    return;
  }

  const startTime = Date.now();
  const interpolator = interpolateRound(fromValue, toValue);

  const performNextUpdate = () => {
    const now = Date.now();
    let iteration = (now - startTime) / TRANSITION_DURATION;

    if (iteration > 1) iteration = 1;

    // Needs reassign so that the value updates in Vue 2
    nodeBlock.node = {
      ...nodeBlock.node,
      transitionValue:
        reset && iteration === 1 ? undefined : interpolator(iteration),
    };

    if (iteration < 1) requestAnimationFrame(performNextUpdate);
  };
  requestAnimationFrame(performNextUpdate);
}
