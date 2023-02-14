import { computed, Ref, ref, watch } from 'vue';
import { SankeyGraph, SankeyNode } from 'd3-sankey';

import { AlluvialDiagramOptions } from '@/composables/options';

import {
  generateLinkId,
  getAlluvialNodeId,
  isSankeyNode,
  updateNode,
} from '../helpers';

import {
  GetHighlightedElementsFunction,
  HighlightedElements,
  NodeBlock,
  SankeyLink,
  SankeyLinkProps,
  SankeyNodeProps,
} from '@/types/alluvial';

function getSourceNodes(
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>,
  group?: { [id: string]: number }
) {
  if (!group) group = {};

  if (node.targetLinks) {
    node.targetLinks.forEach(({ source, value }) => {
      group[(source as SankeyNode<SankeyNodeProps, unknown>).id] = value;
      getSourceNodes(source as SankeyNode<SankeyNodeProps, unknown>, group);
    });
  }

  return group;
}

function getTargetNodes(
  node: SankeyNode<SankeyNodeProps, SankeyLinkProps>,
  group?: { [id: string]: number }
) {
  if (!group) group = {};

  if (node.sourceLinks) {
    node.sourceLinks.forEach(({ target, value }) => {
      group[(target as SankeyNode<SankeyNodeProps, unknown>).id] = value;
      getTargetNodes(target as SankeyNode<SankeyNodeProps, unknown>, group);
    });
  }

  return group;
}

function getLinkIdsFromNodes(
  nodes: { [id: string]: string | number },
  graph: SankeyGraph<SankeyNodeProps, SankeyLinkProps>
): Array<string> {
  return graph.links.reduce((array, link) => {
    if (
      (link as SankeyLink<SankeyNodeProps, SankeyLinkProps>).source.id in
        nodes &&
      (link as SankeyLink<SankeyNodeProps, SankeyLinkProps>).target.id in nodes
    ) {
      array.push(generateLinkId(link));
    }
    return array;
  }, []);
}

const getFullHighlightedElements: GetHighlightedElementsFunction = (
  element,
  graph
) => {
  let nodes: { [id: string]: string | number };

  // Hovering a node
  if (isSankeyNode(element)) {
    nodes = {
      [element.id]: element.value,
      ...getSourceNodes(element),
      ...getTargetNodes(element),
    };
  } else {
    nodes = {
      [element.source.id]: element.source.value,
      [element.target.id]: element.target.value,
      ...getSourceNodes(element.source),
      ...getTargetNodes(element.target),
    };
  }
  const links = getLinkIdsFromNodes(nodes, graph);

  return { nodes, links };
};

const getClosestHighlightedElements: GetHighlightedElementsFunction = (
  element
) => {
  // Hovering a node
  if (isSankeyNode(element)) {
    const links = [...element.sourceLinks, ...element.targetLinks];
    return {
      nodes: links.reduce(
        (acc, { source, target, value }) => {
          if (source === element) {
            return { ...acc, [getAlluvialNodeId(target)]: value };
          }
          return { ...acc, [getAlluvialNodeId(source)]: value };
        },
        { [getAlluvialNodeId(element)]: element.value }
      ),
      links: links.map((l) => generateLinkId(l)),
    };
  }

  // Hovering a link
  return {
    nodes: {
      [getAlluvialNodeId(element.target)]: element.value,
      [getAlluvialNodeId(element.source)]: (
        element.source as SankeyNode<SankeyNodeProps, SankeyLinkProps>
      ).value,
    },
    links: [generateLinkId(element)],
  };
};

export function useAlluvialHover(
  nodeBlocks: Ref<Array<NodeBlock>>,
  options: Ref<AlluvialDiagramOptions>,
  graph: Ref<SankeyGraph<SankeyNodeProps, SankeyLinkProps>>
) {
  const hoveredElement = ref<
    | SankeyNode<SankeyNodeProps, SankeyLinkProps>
    | SankeyLink<SankeyNodeProps, SankeyLinkProps>
  >(null);

  const highlightedElements = computed<HighlightedElements>(() => {
    if (!hoveredElement.value) {
      return { nodes: {}, links: [] };
    }

    // Custom highlight function
    if (typeof options.value.highlightedElements === 'function') {
      return options.value.highlightedElements(
        hoveredElement.value,
        graph.value
      );
    }

    if (options.value.highlightedElements === 'closest') {
      return getClosestHighlightedElements(hoveredElement.value, graph.value);
    }

    return getFullHighlightedElements(hoveredElement.value, graph.value);
  });

  watch(highlightedElements, (elements, lastElements) => {
    if (
      elements.links.length === 0 &&
      Object.keys(elements.nodes).length === 0
    ) {
      // Reset nodes
      nodeBlocks.value.forEach((block) => {
        if (block.node.id in lastElements.nodes) {
          updateNode(
            block,
            lastElements.nodes[block.node.id] as number,
            block.node.value
          );
        }
      });

      return;
    }

    // Update relevant nodes
    nodeBlocks.value.forEach((block) => {
      if (block.node.id in elements.nodes) {
        updateNode(
          block,
          block.node.value,
          elements.nodes[block.node.id] as number
        );
      }
    });
  });

  return { highlightedElements, hoveredElement };
}
