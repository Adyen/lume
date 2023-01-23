<template>
  <g
    v-if="nodeBlocks && linkPaths"
    class="lume-alluvial-group"
    data-j-alluvial-group
  >
    <g
      v-for="(nodeBlock, index) in nodeBlocks"
      :key="`node-block_${index}`"
      class="lume-alluvial-group__node"
      :class="{
        'lume-alluvial-group__node--faded': isNodeFaded(nodeBlock.node.id),
      }"
      data-j-alluvial-group__node-block
    >
      <!-- Wrapper for catching mouse events when hovering both the block and text -->
      <g
        @mouseover="hoveredElement = nodeBlock.node"
        @mouseout="hoveredElement = null"
      >
        <rect
          :class="`lume-alluvial-group__node-block--${
            nodeBlock.node.color || DEFAULT_COLOR
          }`"
          :x="nodeBlock.x"
          :y="nodeBlock.y"
          :height="nodeBlock.height"
          :width="nodeBlock.width"
        />
        <text
          ref="nodeTextRefs"
          class="lume-alluvial-group__node-text lume-typography--caption"
          :class="{
            'lume-alluvial-group__node-text--right': nodeBlock.node.depth === 0,
          }"
          :transform="`translate(${nodeBlock.textTransform.x},${nodeBlock.textTransform.y})`"
          :data-id="nodeBlock.node.id"
        >
          <tspan
            class="lume-alluvial-group__node-title"
            v-text="nodeBlock.node.label"
          />
          <tspan
            class="lume-alluvial-group__node-value"
            x="0"
            dy="1.2em"
            v-text="
              formatValue(
                nodeBlock.node.transitionValue || nodeBlock.node.value
              )
            "
          />
        </text>
      </g>
    </g>
    <g @mouseleave="hoveredElement = null">
      <lume-alluvial-path-group
        :link-paths="linkPaths"
        is-ghost
        data-j-alluvial-group__ghost-path
        @mouseover="hoveredElement = $event"
      />
      <lume-alluvial-path-group
        :link-paths="linkPaths"
        :container-width="containerSize.width"
        :highlighted-links="highlightedElements.links"
        data-j-alluvial-group__path
        @mouseover="hoveredElement = $event"
      />
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, useAttrs, watch } from 'vue';

import LumeAlluvialPathGroup from './components/lume-alluvial-path-group.vue';

import { useFormat } from '@/composables/format';
import { withGroupProps } from '@/composables/group-props';
import { AlluvialDiagramOptions } from '@/composables/options';

import { useAlluvialExtents } from './composables/alluvial-extents';
import { useAlluvialGraph } from './composables/alluvial-graph';
import { useAlluvialHover } from './composables/alluvial-hover';

import { DEFAULT_COLOR } from '@/utils/colors';
import {
  getLabelSizes,
  getLinkPathAttributes,
  getNodeBlockAttributes,
} from './helpers';

import { AlluvialNode } from '@/types/alluvial';
import { ContainerSize } from '@/types/size';

const props = defineProps({
  ...withGroupProps<AlluvialDiagramOptions, AlluvialNode>(),
});

const { containerSize } = <{ containerSize: ContainerSize }>useAttrs();

const { data, options } = toRefs(props);

const nodeBlocks = ref([]);
const linkPaths = ref([]);

const nodeTextRefs = ref<Array<SVGTextElement>>(null);

const { extents, updateExtents } = useAlluvialExtents(containerSize);
const { graph } = useAlluvialGraph(data, options, extents);
const { hoveredElement, highlightedElements } = useAlluvialHover(
  nodeBlocks,
  options,
  graph
);

const formatValue = computed(() => useFormat(options.value.valueFormat));

const hoveredNodeIds = computed(() =>
  Object.keys(highlightedElements.value.nodes)
);

function isNodeFaded(id: string | number) {
  return (
    hoveredNodeIds.value.length > 0 &&
    !hoveredNodeIds.value.includes(id.toString())
  );
}

// Render nodes/paths whenever the SankeyGraph changes
watch(graph, (newGraph) => {
  nodeBlocks.value = getNodeBlockAttributes(newGraph.nodes);
  linkPaths.value = getLinkPathAttributes(newGraph.links);
});

// Update extents whenever 1. container size changes or 2. node labels are rendered (hence defining new margins)
watch([containerSize, nodeTextRefs], () => {
  if (containerSize.width && containerSize.height) {
    const labelSizes = getLabelSizes(graph.value, nodeTextRefs.value);
    updateExtents(labelSizes);
  }
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
