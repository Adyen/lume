import { computed, ComputedRef, ref, Ref, watch } from 'vue';
import { SankeyLink as D3SankeyLink, sankey, SankeyNode } from 'd3-sankey';

import { AlluvialDiagramOptions } from '@/composables/options';

import { Errors, error as logError } from '@/utils/errors';
import { getAlluvialNodeId } from '../helpers';

import {
  AlluvialExtents,
  AlluvialNode,
  SankeyGraph,
  SankeyLinkProps,
  SankeyNodeProps,
} from '@/types/alluvial';
import { InternalData } from '@/types/dataset';

const EMPTY_GRAPH = {
  nodes: [],
  links: [],
} as SankeyGraph;

export function useAlluvialGraph(
  data: Ref<InternalData<AlluvialNode>>,
  options: Ref<AlluvialDiagramOptions>,
  extents: Ref<AlluvialExtents>
) {
  const graph = ref<SankeyGraph>(null);

  const nodes: ComputedRef<
    Array<SankeyNode<SankeyNodeProps, SankeyLinkProps>>
  > = computed(() => {
    return data.value?.[0].values.map(({ label, color, value }) => ({
      label: label || value.toString(),
      color,
      id: value,
    }));
  });

  const links: ComputedRef<
    Array<D3SankeyLink<SankeyNodeProps, SankeyLinkProps>>
  > = computed(() => {
    return data.value?.[0].values
      .map((source) =>
        source.targets?.map(({ node: target, value, color }) => ({
          color,
          source: source.value ?? source.label,
          target,
          value,
        }))
      )
      .filter(Boolean)
      .flat();
  });

  const layout = computed(() => {
    return sankey<SankeyNodeProps, SankeyLinkProps>()
      .nodeId(getAlluvialNodeId)
      .nodeAlign(options.value.nodeAlign)
      .nodePadding(options.value.nodePadding)
      .nodeSort(options.value.nodeSort)
      .nodeWidth(options.value.nodeWidth)
      .linkSort(options.value.linkSort);
  });

  watch([layout, extents], () => {
    try {
      const { x0, y0, x1, y1 } = extents.value;
      graph.value = layout.value.extent([
        [x0, y0],
        [x1, y1],
      ])({ nodes: nodes.value, links: links.value }) as SankeyGraph;
    } catch (error) {
      logError(Errors.GraphProblem, error);
      graph.value = EMPTY_GRAPH;
    }
  });

  return { graph };
}
