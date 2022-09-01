<template>
  <g>
    <g
      v-for="(linkPath, index) in linkPaths"
      :key="`link-path_${index}`"
      class="adv-alluvial-group__path-group"
      style="mix-blend-mode: multiply"
      data-j-alluvial-path__group
    >
      <path
        :id="isGhostPath ? `${linkPath.id}__ghost` : linkPath.id"
        :d="linkPath.d"
        :class="
          isGhostPath
            ? [
              'adv-alluvial-group__path--ghost',
              'adv-stroke-color--transparent',
            ]
            : [
              `adv-stroke-color--${linkPath.color}`,
              `adv-alluvial-group__path--${linkPath.color}`,
              'adv-alluvial-group__path',
            ]
        "
        :stroke-dasharray="containerWidth"
        :stroke-dashoffset="containerWidth"
        :stroke-width="linkPath.strokeWidth + ghostStrokeWidthOffset"
        data-j-alluvial-path__path
        @mouseover="$emit('mouseover', linkPath.link)"
        @mouseout="$emit('mouseout')"
      />
    </g>
  </g>
</template>

<script lang="ts">
import { LinkPath } from '@/types/alluvial';
import { defineComponent, PropType } from 'vue';
import { ghostStrokeWidthOffset } from '../defaults';

export default defineComponent({
  props: {
    linkPaths: {
      type: Array as PropType<Array<LinkPath>>,
      default: () => [],
    },
    isGhostPath: {
      type: Boolean,
      default: false,
    },
    containerWidth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    return {
      ghostStrokeWidthOffset: props.isGhostPath ? ghostStrokeWidthOffset : 0,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
