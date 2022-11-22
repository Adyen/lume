<template>
  <path
    ref="root"
    class="lume-line"
    :class="{
      [`lume-stroke--${color}`]: true,
      'lume-line--dashed': dashed,
      'lume-line--transition': transition,
    }"
    :d="pathDefinition"
    :stroke-width="width"
    :style="{
      animationDelay: transition && animationDelay + 's',
      animationDuration: transition && animationDuration + 's',
    }"
    data-j-line
  />
</template>

<script lang="ts">
import {
  Computed,
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
} from 'vue';

import { Scale } from '@/composables/scales';

import { Colors } from '@/constants';

import { getDomainLength } from '@/utils/helpers';

import { svgCheck } from '@/utils/svg-check';

const LUME_TRANSITION_TIME_FULL = 1; // 1s

const DEFAULT_LINE_WIDTH = 2; // 2px

export default defineComponent({
  props: {
    pathDefinition: {
      type: Computed<string>,
      required: true,
    },
    color: {
      type: String,
      default: Colors.Skyblue,
    },
    width: {
      type: Number,
      default: DEFAULT_LINE_WIDTH,
    },
    xScale: {
      type: Function as PropType<Scale>,
      required: true,
    },
    transition: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const root = ref<SVGPathElement>(null);

    const animationDuration = computed(
      () => LUME_TRANSITION_TIME_FULL / (getDomainLength(props.xScale) - 1) // Subtracting the first line (read below)
    );

    const animationDelay = computed(() => {
      // 0 index is the first line point (which isn't really a line), so it shouldn't have delay
      // 1 index is the actual first line drawn, so it also shouldn't have delay
      if (props.index < 2) return 0;
      return props.transition && (props.index - 1) * animationDuration.value;
    });

    onMounted(() => svgCheck(root.value));

    return {
      animationDelay,
      animationDuration,
      root,
    };
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
