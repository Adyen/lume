<template>
  <g class="bars-group">
    <circle
      v-bind="tooltipAnchorAttributes"
      ref="tooltipAnchor"
    />
    <bar
      v-for="(bar, index) in bars"
      :key="`bar-${index}`"
      v-bind="bar"
      :animate="animate"
    />
    <bar
      v-if="overlay"
      v-bind="overlay"
      fill-class="adv-fill-color-transparent"
      :animate="false"
      @click.native="$emit('click')"
      @mouseover.native="$emit('mouseover', $event)"
      @mouseout.native="$emit('mouseout')"
    />
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import Bar from './bar';

export interface BarConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  fillClass: string;
  isFaded?: boolean;
}

export default defineComponent({
  components: { Bar },
  props: {
    bars: {
      type: Array as PropType<Array<BarConfig>>,
      required: true,
    },
    overlay: {
      type: Object,
      default: null,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const tooltipAnchor = ref(null);

    const tooltipAnchorAttributes = computed(() => {
      // Average between the first and last X points of a group
      const cx =
        (props.bars[0].x +
          props.bars[0].width +
          props.bars[props.bars.length - 1].x) /
        2;

      // Minimum Y value (which means highest bar) of a group
      const cy = Math.min(...props.bars.map((bar) => bar.y));

      return { cx, cy };
    });

    function getTooltipAnchorPoint() {
      return tooltipAnchor.value;
    }

    return { tooltipAnchor, tooltipAnchorAttributes, getTooltipAnchorPoint };
  },
});
</script>
