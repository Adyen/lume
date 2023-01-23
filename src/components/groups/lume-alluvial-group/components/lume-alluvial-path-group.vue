<template>
  <g class="lume-alluvial-path-group">
    <path
      v-for="linkPath in linkPaths"
      :key="`link_${linkPath.id}`"
      class="lume-alluvial-path-group__link"
      :class="{
        [`lume-stroke--${linkPath.color}`]: !isGhost,
        'lume-stroke--transparent': isGhost,
        'lume-alluvial-path-group__link--ghost': isGhost,
        'lume-alluvial-path-group__link--faded': isLinkFaded(linkPath.id),
      }"
      :d="linkPath.d"
      :stroke-dasharray="containerWidth"
      :stroke-dashoffset="containerWidth"
      :stroke-width="linkPath.strokeWidth + ghostStrokeWidthOffset"
      data-j-alluvial-path__path
      :data-id="isGhost ? `${linkPath.id}__ghost` : linkPath.id"
      @mouseover="emit('mouseover', linkPath.link)"
      @mouseout="emit('mouseout')"
    />
  </g>
</template>

<script setup lang="ts">
import { computed, defineProps, PropType, toRefs } from 'vue';
import { SankeyLink } from 'd3-sankey';

import { GHOST_STROKE_WIDTH_OFFSET } from '../constants';

import { LinkPath, SankeyLinkProps, SankeyNodeProps } from '@/types/alluvial';

const props = defineProps({
  linkPaths: {
    type: Array as PropType<Array<LinkPath>>,
    default: () => [],
  },
  isGhost: {
    type: Boolean,
    default: false,
  },
  containerWidth: {
    type: Number,
    default: 0,
  },
  highlightedLinks: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: 'mouseover', value: SankeyLink<SankeyNodeProps, SankeyLinkProps>): void;
  (e: 'mouseout');
}>();

const { highlightedLinks, isGhost } = toRefs(props);

const ghostStrokeWidthOffset = computed(() =>
  isGhost.value ? GHOST_STROKE_WIDTH_OFFSET : 0
);

function isLinkFaded(id: string) {
  return (
    highlightedLinks.value.length > 0 && !highlightedLinks.value.includes(id)
  );
}
</script>

<style lang="scss" scoped>
@use './styles';
</style>
