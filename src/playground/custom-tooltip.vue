<template>
  <adv-custom-tooltip v-bind="$props">
    <template #content="{ data, hoveredIndex }">
      {{ getContent(hoveredIndex, data) }}
    </template>
  </adv-custom-tooltip>
</template>

<script lang="ts">
import AdvCustomTooltip from '@/core/adv-custom-tooltip';
import { Data } from '@/types/dataset';
import {
  defineComponent,
  PropType,
} from '@vue/composition-api';

const EMOJI_MAP = {
  positive: '🚀',
  negative: '😖',
};

export default defineComponent({
  components: {
    AdvCustomTooltip
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
  setup(props) {
    function getContent(index: number, data) {
      const prev =
        index > 0 ? data[0].values[index - 1]?.value : -1;
      const current = data[0].values[index]?.value;
      const emoji = EMOJI_MAP[prev > current ? 'negative' : 'positive'];
      return `${emoji} goin' ${prev > current ? 'down' : 'up'}`;
    }

    return { getContent };
  },
});
</script>
