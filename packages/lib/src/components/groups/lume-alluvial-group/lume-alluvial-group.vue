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
      <!-- Gradient defs -->
      <defs v-if="options.gradient">
        <linearGradient
          v-for="(gradient, id) in gradients"
          :id="`${chartID}_${id}`"
          :key="id"
          gradientUnits="userSpaceOnUse"
          :x1="gradient.x1"
          :x2="gradient.x2"
        >
          <stop
            offset="0%"
            :stop-color="`var(--lume-color--${gradient.source})`"
          />
          <stop
            offset="100%"
            :stop-color="`var(--lume-color--${gradient.target})`"
          />
        </linearGradient>
      </defs>

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
          [`lume-stroke--${linkPath.color}`]:
            !options.gradient && linkPath.color,
          'lume-alluvial-group__link--faded': isLinkFaded(linkPath.id),
          'lume-alluvial-group__link--focused': isLinkFocused(linkPath.id),
        }"
        :d="linkPath.d"
        :stroke="getLinkStroke(linkPath.link)"
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
        'lume-alluvial-group__node--focused': isNodeFocused(block.node.id),
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
        <template v-if="shouldDeriveNodeColorFromIncomingLinks(block)">
          <rect
            v-for="nodeBlock in getSubNodesDerivingColorFromIncomingLinks(
              block.node.id
            )"
            v-bind="nodeBlock"
            :key="nodeBlock.key"
            data-j-alluvial-sub-nodes
          />
        </template>
        <rect
          v-else
          class="lume-alluvial-group__node-block"
          :class="`lume-fill--${block.node.color || block.node.fallbackColor}`"
          :x="block.x"
          :y="block.y"
          :height="block.height"
          :width="block.width"
        />
        <text
          ref="nodeTextRefs"
          class="lume-alluvial-group__node-text lume-typography--caption"
          :class="{
            'lume-alluvial-group__node-text--left': block.node.depth === 0,
          }"
          :transform="`translate(${block.textTransform.x},${block.textTransform.y})`"
          :data-id="block.node.id"
        >
          <slot
            :name="`node-text-${block.node.id}`"
            :node="block.node"
          >
            <lume-alluvial-node-label>
              {{ block.node.label }}
            </lume-alluvial-node-label>
            <lume-alluvial-node-value>
              {{
                formatValue(
                  block.node.transitionValue || block.node.value,
                  block.node.value
                )
              }}
            </lume-alluvial-node-value>
          </slot>
        </text>
      </g>
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed, inject, PropType, ref, toRefs, watch } from 'vue';

import LumeAlluvialNodeLabel from './components/lume-alluvial-node-label';
import LumeAlluvialNodeValue from './components/lume-alluvial-node-value';

import { useFormat } from '@/composables/format';
import { withGroupProps } from '@/composables/group-props';
import { AlluvialDiagramOptions } from '@/composables/options';

import { useAlluvialExtents } from './composables/alluvial-extents';
import { useAlluvialGraph } from './composables/alluvial-graph';
import { useAlluvialHover } from './composables/alluvial-hover';

import { DEFAULT_COLOR } from '@/utils/colors';
import { Color } from '@/utils/constants';
import { warn, Warnings } from '@/utils/warnings';
import { GHOST_STROKE_WIDTH_OFFSET, NODE_HEADER_PADDING } from './constants';
import {
  generateLinkId,
  getLabelSizes,
  getLinkById,
  getLinkPathAttributes,
  getNodeBlockAttributes,
  getNodeById,
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
  hoveredElementId: {
    type: [Number, String] as PropType<number | string>,
    default: null,
  },
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

const chartID = inject<string>('chartID');

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

const gradients = computed(() => {
  if (!options.value.gradient || !graph.value) return;

  return graph.value.links.reduce((acc, link) => {
    acc[generateLinkId(link)] = {
      source: link.source.color || link.source.fallbackColor,
      target: link.target.color || link.target.fallbackColor,
      x1: link.source.x1,
      x2: link.target.x0,
    };
    return acc;
  }, {}) as Record<
    string,
    { source: Color; target: Color; x1: number; x2: number }
  >;
});

const nodesDerivingColorFromIncomingLinks = computed(() => {
  const nodeBlocksExpectingColorDerivation = nodeBlocks.value.filter((block) =>
    shouldDeriveNodeColorFromIncomingLinks(block)
  );
  const subNodeDetails = [];

  nodeBlocksExpectingColorDerivation.forEach((nodeBlock) => {
    const nodesBasedOnIncomingLinks = [];
    // Link ordering was reversed so that furthermost links are rendered on the top. Have to reverse it back to compute heights of node segments for appropriate links
    linkPaths.value
      .filter(({ link }) => link.target.id === nodeBlock.node.id)
      .reverse()
      .reduce((accumulatedHeight, currentLinkPath) => {
        const targetNodeHeight =
          currentLinkPath.link.target.y1 - currentLinkPath.link.target.y0;
        const linkRatioOfSourceInTarget =
          currentLinkPath.link.value / nodeBlock.node.value;
        const linkHeightOfSourceInTarget =
          linkRatioOfSourceInTarget * targetNodeHeight;

        nodesBasedOnIncomingLinks.push({
          x: nodeBlock.x,
          y: nodeBlock.y + accumulatedHeight,
          height: linkHeightOfSourceInTarget,
          width: nodeBlock.width,
          key: `node-block-${nodeBlock.node.id}-source-link-${currentLinkPath.link.source.id}`,
          class: `lume-alluvial-group__node-block lume-fill--${
            currentLinkPath.link.source.color || DEFAULT_COLOR
          }`,
        });

        return accumulatedHeight + linkHeightOfSourceInTarget;
      }, 0);

    subNodeDetails.push({
      id: nodeBlock.node.id,
      subNodes: nodesBasedOnIncomingLinks,
    });
  });

  return subNodeDetails;
});

function getLinkStroke(link: SankeyLink<SankeyNodeProps, SankeyLinkProps>) {
  return options.value.gradient && `url('#${chartID}_${generateLinkId(link)}')`;
}

function isNodeFaded(id: string | number) {
  return (
    hoveredNodeIds.value.length > 0 &&
    !hoveredNodeIds.value.includes(id.toString())
  );
}

function isNodeFocused(id: string | number) {
  return (
    hoveredNodeIds.value.length > 0 &&
    hoveredNodeIds.value.includes(id.toString())
  );
}

function isLinkFaded(id: string) {
  return (
    highlightedElements.value.links.length > 0 &&
    !highlightedElements.value.links.includes(id)
  );
}

function isLinkFocused(id: string) {
  return (
    highlightedElements.value.links.length > 0 &&
    highlightedElements.value.links.includes(id)
  );
}

function shouldDeriveNodeColorFromIncomingLinks(block: NodeBlock) {
  return !block.node.color && block.node.deriveColorFromIncomingLinks;
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

function handleExternalHover(id: number | string) {
  if (id == null) {
    hoveredElement.value = null;
    return;
  }

  const element =
    getNodeById(id, graph.value) || getLinkById(id as string, graph.value);

  if (!element) {
    warn(Warnings.InvalidHoveredElement);
    return;
  }

  hoveredElement.value = element;
}

function getSubNodesDerivingColorFromIncomingLinks(nodeId: number | string) {
  return (
    nodesDerivingColorFromIncomingLinks.value.find(({ id }) => nodeId === id)
      ?.subNodes ?? []
  );
}

// Render nodes/paths whenever the SankeyGraph changes
watch(graph, (newGraph) => {
  nodeBlocks.value = getNodeBlockAttributes(newGraph.nodes);
  linkPaths.value = getLinkPathAttributes(newGraph.links).reverse(); // Reverse order of link rendering so that the furthermost links are renderd on top

  // Handle initial hoveredElement from props
  if (hoveredElement.value == null && props.hoveredElementId != null) {
    handleExternalHover(props.hoveredElementId);
  }
});

// Update extents whenever 1. container size changes or 2. node labels are rendered (hence defining new margins)
watch([props.containerSize, nodeTextRefs], () => {
  if (props.containerSize.width && props.containerSize.height) {
    const labelSizes = getLabelSizes(graph.value, nodeTextRefs.value);
    updateExtents(labelSizes);
  }
});

watch(() => props.hoveredElementId, handleExternalHover);
</script>

<style lang="scss" scoped>
@use './styles';
</style>
