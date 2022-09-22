<template>
  <div
    v-if="opened"
    class="adv-horizontal-tooltip"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    data-j-horizontal-tooltip
  >
    <slot
      name="content"
      :hovered-index="hoveredIndex"
      :data="computedData"
    >
      {{ getContent(hoveredIndex) }}
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs, watch } from 'vue';

import { useBase } from '@/composables/base';

import { NO_DATA } from '@/constants';
import { Data } from '@/types/dataset';

export default defineComponent({
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

    const { computedData } = useBase(data);

    const position = ref({ x: 0, y: 0 });

    function getContent(index: number) {
      return computedData.value[0].values[index]?.value || NO_DATA;
    }

    watch(
      targetElement,
      (el) => {
        if (!el) return;
        position.value = el.getBoundingClientRect();
      },
      { immediate: true }
    );

    return { computedData, getContent, position };
  },
});
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
