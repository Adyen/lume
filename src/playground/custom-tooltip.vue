<template>
  <adv-horizontal-tooltip v-bind="$props">
    <template #content="{ data: slotData, hoveredIndex: slotHoveredIndex }">
      {{ getContent(slotHoveredIndex, slotData) }}
    </template>
  </adv-horizontal-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import AdvHorizontalTooltip from '@/core/adv-horizontal-tooltip';

import { Data } from '@/types/dataset';

const EMOJI_MAP = {
  positive: '🚀',
  negative: '😖',
};

export default defineComponent({
  components: {
    AdvHorizontalTooltip,
  },
  props: {
    data: {
      type: Array as PropType<Data>,
      required: true,
    },
    opened: {
      type: Boolean,
      required: true,
    },
    targetElement: {
      type: Element,
      default: null,
    },
    hoveredIndex: {
      type: Number,
      default: -1,
    },
  },
  setup() {
    function getContent(index: number, data) {
      const prev = index > 0 ? data[0].values[index - 1]?.value : -1;
      const current = data[0].values[index]?.value;
      const emoji = EMOJI_MAP[prev > current ? 'negative' : 'positive'];
      return `${emoji} goin' ${prev > current ? 'down' : 'up'}`;
    }

    return { getContent };
  },
});
</script>
