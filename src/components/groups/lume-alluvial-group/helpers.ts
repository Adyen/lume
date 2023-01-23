import Vue from 'vue';
import {
  SankeyGraph,
  SankeyLink,
  sankeyLinkHorizontal,
  SankeyNode,
} from 'd3-sankey';

import { interpolateRound } from '@/utils/helpers';

import { DEFAULT_COLOR, NODE_LABEL_PADDING } from './constants';

import {
  LinkPath,
  NodeBlock,
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
  return (
    (link.source as SankeyNode<SankeyNodeProps, SankeyLinkProps>).id +
    ':' +
    (link.target as SankeyNode<SankeyNodeProps, SankeyLinkProps>).id
  );
}

export function isSankeyNode(
  element: SankeyNode<unknown, unknown> | SankeyLink<unknown, unknown>
): element is SankeyNode<unknown, unknown> {
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

export function updateNode(
  nodeBlock: NodeBlock,
  currentNumber: number,
  targetNumber: number
) {
  const startTime = Date.now();
  const interpolator = interpolateRound(currentNumber, targetNumber);

  const performNextUpdate = () => {
    const now = Date.now();
    let iteration = (now - startTime) / TRANSITION_DURATION;
    if (iteration > 1) {
      iteration = 1;
    }

    Vue.set(nodeBlock.node, 'transitionValue', interpolator(iteration));

    if (iteration < 1) {
      requestAnimationFrame(performNextUpdate);
    }
  };
  requestAnimationFrame(performNextUpdate);
}
