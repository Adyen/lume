<template>
  <g
    class="lume-alluvial-group"
    data-j-alluvial-group
  >
    <!-- Level titles -->
    <g v-if="nodeHeaders">
      <text
        v-for="header in nodeHeaders"
        :key="`header_${header.x}`"
        :x="header.x"
        :y="-computedNodeHeaderPadding"
        class="lume-alluvial-group__node-header lume-typography--caption"
      >
        {{ header.label }}
      </text>
    </g>

    <!-- Links -->
    <g
      class="lume-alluvial-link-group"
      @mouseleave="handleLinkMouseleave"
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
        @click="emit('link-click', { link: linkPath.link, event: $event })"
        @mouseover="handleLinkMouseover(linkPath.link, $event)"
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
        :data-id="linkPath.id"
        @click="emit('link-click', { link: linkPath.link, event: $event })"
        @mouseover="handleLinkMouseover(linkPath.link, $event)"
      />
    </g>

    <!-- Nodes -->
    <g
      v-for="(block, index) in nodeBlocks"
      :key="`node-block_${index}`"
      class="lume-alluvial-group__node"
      :class="{
        'lume-alluvial-group__node--faded': isNodeFaded(block.node.id),
      }"
      data-j-alluvial-group__node-block
    >
      <!-- Wrapper for catching mouse events when hovering both the block and text -->
      <g
        @click="emit('node-click', { node: block.node, event: $event })"
        @mouseenter="
          emit('node-mouseenter', { node: block.node, event: $event })
        "
        @mouseleave="
          emit('node-mouseleave', { node: block.node, event: $event })
        "
        @mouseover="hoveredElement = block.node"
        @mouseout="hoveredElement = null"
      >
        <rect
          :class="`lume-alluvial-group__node-block--${
            block.node.color || DEFAULT_COLOR
          }`"
          :x="block.x"
          :y="block.y"
          :height="block.height"
          :width="block.width"
        />
        <text
          ref="nodeTextRefs"
          class="lume-alluvial-group__node-text lume-typography--caption"
          :class="{
            'lume-alluvial-group__node-text--right': block.node.depth === 0,
          }"
          :transform="`translate(${block.textTransform.x},${block.textTransform.y})`"
          :data-id="block.node.id"
        >
          <tspan
            class="lume-alluvial-group__node-title"
            v-text="block.node.label"
          />
          <tspan
            class="lume-alluvial-group__node-value"
            x="0"
            dy="1.2em"
            v-text="
              formatValue(
                block.node.transitionValue || block.node.value,
                block.node.value
              )
            "
          />
        </text>
      </g>
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

import { GHOST_STROKE_WIDTH_OFFSET, NODE_HEADER_PADDING } from './constants';
import { DEFAULT_COLOR } from '@/utils/colors';
import {
  getLabelSizes,
  getLinkPathAttributes,
  getNodeBlockAttributes,
} from './helpers';

import {
  AlluvialNode,
  LinkPath,
  NodeBlock,
  SankeyLink,
  SankeyLinkProps,
  SankeyNodeProps,
} from '@/types/alluvial';
import {
  AlluvialLinkEventPayload,
  AlluvialNodeEventPayload,
} from '@/types/events';

const props = defineProps({
  ...withGroupProps<AlluvialDiagramOptions, AlluvialNode>(),
});

const emit = defineEmits<{
  (
    e: 'node-click' | 'node-mouseenter' | 'node-mouseleave',
    p: AlluvialNodeEventPayload
  ): void;
  (
    e: 'link-click' | 'link-mouseenter' | 'link-mouseleave',
    p: AlluvialLinkEventPayload
  ): void;
}>();

const { data, options } = toRefs(props);

const nodeBlocks = ref<Array<NodeBlock>>([]);
const linkPaths = ref<Array<LinkPath>>([]);

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

const nodeColumnPositions = computed<Array<number>>(
  () =>
    nodeBlocks.value
      .reduce((acc, curr) => {
        const columnX = curr.x + options.value.nodeWidth / 2;

        return acc.includes(columnX) ? acc : [...acc, columnX];
      }, [])
      .sort((a, b) => a - b) // Make sure positions are sorted in ascending order
);

const nodeHeaders = computed(() => {
  if (!options.value.nodeHeaders || !options.value.nodeHeaders.length) return;

  return options.value.nodeHeaders
    .slice(0, nodeColumnPositions.value.length) // Match column/header array lengths
    .map((header, index) => ({
      label: header,
      x: nodeColumnPositions.value[index],
    }));
});

const computedNodeHeaderPadding = computed(
  () => options.value.nodeHeaderPadding ?? NODE_HEADER_PADDING
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

function handleLinkMouseover(
  link: SankeyLink<SankeyNodeProps, SankeyLinkProps>,
  event: MouseEvent
) {
  if (link === hoveredElement.value) return;

  hoveredElement.value = link;
  emit('link-mouseenter', { link, event });
}

function handleLinkMouseleave(event: MouseEvent) {
  const link = hoveredElement.value as SankeyLink<
    SankeyNodeProps,
    SankeyLinkProps
  >;
  hoveredElement.value = null;
  emit('link-mouseleave', { link, event });
}

// Render nodes/paths whenever the SankeyGraph changes
watch(graph, (newGraph) => {
  nodeBlocks.value = getNodeBlockAttributes(newGraph.nodes);
  linkPaths.value = getLinkPathAttributes(newGraph.links).reverse(); // Reverse order of link rendering so that the furthermost links are renderd on top
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
