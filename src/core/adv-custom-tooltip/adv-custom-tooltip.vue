<template>
  <div
    v-if="opened"
    class="adv-custom-tooltip"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
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
import { useBase } from '@/mixins/base';
import { Data } from '@/types/dataset';
import { NO_DATA } from '@/constants';

import {
  defineComponent,
  PropType,
  ref,
  toRefs,
  watch,
} from '@vue/composition-api';


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

    const { computedData } = useBase(data);

    const position = ref({ x: 0, y: 0 });

    function getContent(index: number) {
      return computedData.value[0].values[index]?.value || NO_DATA;
    }

    watch(targetElement, (el) => {
      if (!el) return;
      position.value = el.getBoundingClientRect();
    });

    return { getContent, position, computedData };
  },
});
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
