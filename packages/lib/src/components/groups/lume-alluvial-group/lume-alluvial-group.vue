<template>
  <g
    class="lume-alluvial-group"
    data-j-alluvial-group
  >
    <!-- Nodes -->
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

    <!-- Links -->
    <g
      class="lume-alluvial-link-group"
      @mouseleave="hoveredElement = null"
    >
      <!-- Ghost paths -->
      <path
        v-for="linkPath in linkPaths"
        :key="`link-ghost_${linkPath.id}`"
        class="lume-alluvial-group__link"
        :class="[
          'lume-stroke--transparent',
          'lume-alluvial-group__link--ghost',
        ]"
        :d="linkPath.d"
        :stroke-width="linkPath.strokeWidth + GHOST_STROKE_WIDTH_OFFSET"
        data-j-alluvial-ghost
        @mouseover="hoveredElement = linkPath.link"
      />

      <!-- Link paths -->
      <path
        v-for="linkPath in linkPaths"
        :key="`link_${linkPath.id}`"
        class="lume-alluvial-group__link"
        :class="{
          [`lume-stroke--${linkPath.color}`]: linkPath.color,
          'lume-alluvial-group__link--faded': isLinkFaded(linkPath.id),
        }"
        :d="linkPath.d"
        :stroke-dasharray="containerSize.width"
        :stroke-dashoffset="containerSize.width"
        :stroke-width="linkPath.strokeWidth"
        data-j-alluvial-path
        @mouseover="hoveredElement = linkPath.link"
      />
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';

import { useFormat } from '@/composables/format';
import { withGroupProps } from '@/composables/group-props';
import { AlluvialDiagramOptions } from '@/composables/options';

import { useAlluvialExtents } from './composables/alluvial-extents';
import { useAlluvialGraph } from './composables/alluvial-graph';
import { useAlluvialHover } from './composables/alluvial-hover';

import { GHOST_STROKE_WIDTH_OFFSET } from './constants';
import { DEFAULT_COLOR } from '@/utils/colors';
import {
  getLabelSizes,
  getLinkPathAttributes,
  getNodeBlockAttributes,
} from './helpers';

import { AlluvialNode } from '@/types/alluvial';

const props = defineProps({
  ...withGroupProps<AlluvialDiagramOptions, AlluvialNode>(),
});

const { data, options } = toRefs(props);

const nodeBlocks = ref([]);
const linkPaths = ref([]);

const nodeTextRefs = ref<Array<SVGTextElement>>(null);

const { extents, updateExtents } = useAlluvialExtents(props.containerSize);
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

function isLinkFaded(id: string) {
  return (
    highlightedElements.value.links.length > 0 &&
    !highlightedElements.value.links.includes(id)
  );
}

// Render nodes/paths whenever the SankeyGraph changes
watch(graph, (newGraph) => {
  nodeBlocks.value = getNodeBlockAttributes(newGraph.nodes);
  linkPaths.value = getLinkPathAttributes(newGraph.links);
});

// Update extents whenever 1. container size changes or 2. node labels are rendered (hence defining new margins)
watch([props.containerSize, nodeTextRefs], () => {
  if (props.containerSize.width && props.containerSize.height) {
    const labelSizes = getLabelSizes(graph.value, nodeTextRefs.value);
    updateExtents(labelSizes);
  }
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
