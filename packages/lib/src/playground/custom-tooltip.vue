<template>
  <div
    v-show="opened"
    class="custom-tooltip"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
  >
    {{ getContent(hoveredIndex) }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs, watch } from 'vue';

import { useBase } from '@/composables/base';

import { Data } from '@/types/dataset';

const EMOJI_MAP = {
  positive: '🚀',
  negative: '😖',
};

export default defineComponent({
  components: {},
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
    const { data, targetElement } = toRefs(props);

    const { internalData } = useBase(data);

    const position = ref({ x: 0, y: 0 });

    function getContent(index: number) {
      const prev =
        index > 0 ? internalData.value[0].values[index - 1]?.value : -1;
      const current = internalData.value[0].values[index]?.value;

      const emoji = EMOJI_MAP[prev > current ? 'negative' : 'positive'];
      return `${emoji} goin' ${prev > current ? 'down' : 'up'}`;
    }

    watch(targetElement, (el) => {
      if (!el) return;
      position.value = el.getBoundingClientRect();
    });

    return { getContent, position };
  },
});
</script>

<style lang="scss" scoped>
.custom-tooltip {
  position: fixed;

  pointer-events: none;
  transition: all 0.2s ease-out;
}
</style>
