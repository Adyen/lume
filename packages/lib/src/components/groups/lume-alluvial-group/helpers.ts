import { sankeyLinkHorizontal, SankeyNode } from 'd3-sankey';

import { DEFAULT_COLOR } from '@/utils/colors';
import { interpolateRound } from '@/utils/helpers';

import { NODE_LABEL_PADDING } from './constants';

import {
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

export function generateLinkId(
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>
) {
  return link.source.id + ':' + link.target.id;
}

export function isSankeyNode(
  element:
    | SankeyNode<SankeyNodeProps, unknown>
    | SankeyLink<SankeyNodeProps, unknown>
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
  return nodes.map((node) => ({
    x: node.x0,
    y: node.y0,
    width: node.x1 - node.x0,
    height: node.y1 - node.y0,
    textTransform: {
      x:
        node.depth > 0
          ? node.x1 + NODE_LABEL_PADDING
          : node.x0 - NODE_LABEL_PADDING,
      y: (node.y1 + node.y0) / 2,
    },
    node,
  }));
}

export function getLinkPathAttributes(
  links: Array<SankeyLink<SankeyNodeProps, SankeyLinkProps>>
): Array<LinkPath> {
  const pathDirection = sankeyLinkHorizontal();
  return links.map((link) => ({
    id: generateLinkId(link),
    color:
      link.color ||
      (link.source as SankeyNode<SankeyNodeProps, SankeyLinkProps>)?.color ||
      DEFAULT_COLOR,
    d: pathDirection(link),
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
