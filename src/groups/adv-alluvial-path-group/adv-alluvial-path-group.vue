<template>
  <g class="adv-alluvial-path-group">
    <path
      v-for="linkPath in linkPaths"
      :id="isGhost ? `${linkPath.id}__ghost` : linkPath.id"
      :key="`link_${linkPath.id}`"
      class="adv-alluvial-path-group__link"
      :class="getClasses(linkPath)"
      :d="linkPath.d"
      :stroke-dasharray="containerWidth"
      :stroke-dashoffset="containerWidth"
      :stroke-width="linkPath.strokeWidth + ghostStrokeWidthOffset"
      data-j-alluvial-path__path
      @mouseover="emit('mouseover', linkPath.link)"
      @mouseout="emit('mouseout')"
    />
  </g>
</template>
<script lang="ts">

export const GHOST_STROKE_WIDTH_OFFSET = 8;

</script>

<script setup lang="ts">
import { computed, PropType, toRefs } from 'vue';

import { isNodeOrLinkFaded } from '@/utils/helpers';

import { LinkPath } from '@/types/alluvial';

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
  highlightedLinkIds: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
});

const emit = defineEmits(['mouseover', 'mouseout'])

const { highlightedLinkIds, isGhost } = toRefs(props);

const ghostStrokeWidthOffset = computed(() =>
  isGhost.value ? GHOST_STROKE_WIDTH_OFFSET : 0
);

function getClasses(linkPath: LinkPath) {
  return {
    [`adv-stroke--${linkPath.color}`]: !isGhost.value,
    'adv-stroke--transparent': isGhost.value,
    'adv-alluvial-path-group__link--ghost': isGhost.value,
    'adv-alluvial-path-group__link--faded': isNodeOrLinkFaded(
      linkPath.id,
      highlightedLinkIds.value
    ),
  };
}
</script>

<style lang="scss" scoped>
@use './styles';
</style>
