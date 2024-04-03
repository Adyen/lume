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

export function getLabelSizes(
  graph: SankeyGraph<SankeyNodeProps, SankeyLinkProps>,
  nodeTextElements: Array<SVGTextElement>
) {
  if (!nodeTextElements) return;

  const startNodeIDs = graph.nodes
    .filter((node) => node.targetLinks.length === 0)
    .map((n) => `${n.id}`);
  const endNodeIDs = graph.nodes
    .filter((node) => node.sourceLinks.length === 0)
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

  return {
    left: maxStartNodeWidth,
    top: 0,
    right: maxEndNodeWidth,
    bottom: 0,
  };
}

export function getNodeBlockAttributes(
  nodes: Array<SankeyNode<SankeyNodeProps, SankeyLinkProps>>
): Array<NodeBlock> {
  return nodes.map((node) => {
    const isMinimumHeight = node.y1 - node.y0 < NODE_MINIMUM_HEIGHT;
    return {
      x: node.x0,
      y: node.y0 - (isMinimumHeight ? NODE_MINIMUM_HEIGHT / 2 : 0), // Negative offset to account for the min. height
      width: node.x1 - node.x0,
      height: isMinimumHeight ? NODE_MINIMUM_HEIGHT : node.y1 - node.y0,
      textTransform: {
        x:
          node.depth > 0
            ? node.x1 + NODE_LABEL_PADDING
            : node.x0 - NODE_LABEL_PADDING,
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
