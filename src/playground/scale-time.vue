<template>
  <svg
    :width="containerSize.width"
    :height="containerSize.height"
  >
    <line
      stroke="limegreen"
      stroke-width="2"
      x1="0"
      :x2="containerSize.width"
    />
    <g
      v-for="(tick, i) in scale.ticks(tickCount)"
      :key="i"
      @mouseover="handleMouseover(i)"
      @mouseout="handleMouseout"
    >
      <line
        y1="0"
        :y2="showTick(i) ? 16 : 8"
        :x1="scale(tick)"
        :x2="scale(tick)"
        stroke="orangered"
        stroke-width="4"
      />
      <text
        ref="ghostLabels"
        :x="scale(tick)"
        :y="showTick(i) ? 16 : 32"
        dy="0.8em"
        font-size="10"
        text-anchor="middle"
        class="tick"
        :class="[
          showTick(i) ? 'tick--visible' : 'tick--hidden',
          hoveredIndex === i && 'tick--hovered',
        ]"
      >
        {{
          tick.toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
          })
        }}
      </text>
    </g>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from 'vue';
import { scaleTime } from 'd3-scale';

import { useSkip } from '@/core/lume-axis/composables/lume-skip';

export default defineComponent({
  props: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    tickCount: {
      type: Number,
      default: 10,
    },
    skipNumber: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { startDate, endDate } = toRefs(props);
    const ghostLabels = ref(null);
    const hoveredIndex = ref(-1);

    const containerSize = {
      width: 700,
      height: 200,
    };

    const scale = computed(() =>
      scaleTime()
        .rangeRound([0, containerSize.width])
        .domain([startDate.value, endDate.value])
        .nice()
    );

    const { showTick } = useSkip(scale, ghostLabels, props.skipNumber);

    function handleMouseover(index: number) {
      hoveredIndex.value = index;
    }

    function handleMouseout() {
      hoveredIndex.value = -1;
    }

    return {
      scale,
      containerSize,
      ghostLabels,
      hoveredIndex,
      showTick,
      handleMouseover,
      handleMouseout,
    };
  },
});
</script>

<style lang="scss" scoped>
.tick {
  cursor: default;

  &--hidden {
    fill: lightslategrey;
  }

  &--hovered {
    fill: slateblue;
  }
}
</style>
