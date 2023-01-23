import { computed, Ref, ref, watch } from 'vue';
import { SankeyGraph, SankeyLink, SankeyNode } from 'd3-sankey';

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
  SankeyLinkProps,
  SankeyNodeProps,
} from '@/types/alluvial';

const defaultGetHighlightedElements: GetHighlightedElementsFunction = (
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

    if (options.value.getHighlightedElements) {
      return options.value.getHighlightedElements(
        hoveredElement.value,
        graph.value
      );
    }

    return defaultGetHighlightedElements(hoveredElement.value);
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

  return {
    highlightedElements,
    hoveredElement,
  };
}
