import { computed, ComputedRef, ref, Ref, set } from "@vue/composition-api";
import {
    Alluvial,
    AlluvialInstance,
    AlluvialLink,
    AlluvialNode,
    SankeyElements, SankeyNode
} from "@/types/alluvial";
import { sankey } from 'd3-sankey';
import { ContainerSize } from "@/types/size";

export function useBase(
    alluvialProps: Ref<Alluvial>,
    alluvialData: Ref<AlluvialInstance>
) {

    const alluvialInstance = ref(alluvialData);
    const nodes: ComputedRef<AlluvialNode[]> = computed(() => {
        return alluvialProps.value.values.map(({ label, color, id }) => ({ label, color, id }))
    });

    const links: ComputedRef<AlluvialLink[]> = computed(() => {
        return alluvialProps.value.values
            .map(source => source.targets?.map(({ node: target, value, color }) => ({
                source: source.id ?? source.label,
                color,
                target,
                value,
            })))
            .filter(Boolean)
            .reduce((aggregatedLinks, links) => [...aggregatedLinks, ...links], []);
    });

    const layout: ComputedRef<Function> = computed(() => {
        const { leftExtent, rightExtent, topExtent, bottomExtent, containerSize } = alluvialInstance.value;
        return sankey()
            .nodeId(nodeId)
            .nodeWidth(alluvialProps.value.nodeWidth)
            .nodeSort(alluvialProps.value.nodeSort)
            .nodePadding(20)
            .nodeAlign(alluvialProps.value.nodeAlign)
            .extent([[leftExtent, topExtent], [rightExtent, containerSize.height - bottomExtent]]);
    });

    const graph: ComputedRef<SankeyElements> = computed(() => {
        return layout.value({
            nodes: nodes.value.map(node => ({ ...node })),
            links: links.value.map(link => ({ ...link }))
        });
    });

    function nodeId(node: AlluvialNode | SankeyNode): number | string  {
        return node.id ?? node.label;
    }

    function updateSize(size: ContainerSize) {
        set(alluvialInstance.value.containerSize, 'width', size.width);
        set(alluvialInstance.value.containerSize, 'height', size.height);
    }

    return {
        nodes,
        links,
        graph,
        nodeId,
        updateSize,
        alluvialInstance
    };
}