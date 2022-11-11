<template>
  <g>
    <g
      v-for="(dataset, index) in data"
      :key="dataset.label"
      :transform="`translate(0, ${getDatasetY(dataset, index)})`"
    >
      <g
        v-for="(valuePair, pairIndex) in dataset.values"
        :key="`pair_${pairIndex}`"
        :transform="`translate(0, ${pairIndex * BAR_GROUP_HEIGHT})`"
      >
        <text
          dominant-baseline="hanging"
          class="lume-typography--body"
        >
          {{ labels[pairIndex] }}
        </text>
        <lume-bar
          :y="TEXT_HEIGHT"
          :width="computedXScale(valuePair.value)"
          :height="BAR_HEIGHT"
          :class-list="`lume-fill--${valuePair.color}`"
        />
        <text
          ref="labelRefs"
          dominant-baseline="hanging"
          class="lume-typography--caption"
          :x="computedXScale(valuePair.value) + 8"
          :y="TEXT_HEIGHT + 2"
        >
          <tspan>
            {{ valuePair.value }}
          </tspan>
          <tspan
            v-if="valuePair.percentage"
            :class="[
              'percentage',
              valuePair.percentage > 0 ? 'lume-fill--03' : 'lume-fill--09',
            ]"
          >
            <template v-if="valuePair.percentage > 0">
              ↑
            </template>
            <template v-else>
              ↓
            </template>
            {{ valuePair.percentage }}%
          </tspan>
        </text>
      </g>
    </g>
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { scaleLinear } from 'd3';

import LumeBar from '@/components/core/lume-bar';

import { withGroupProps } from '@/components/groups/composables/group-props';
import { InternalDataset } from '@/types/dataset';
import { flatValues } from '@/utils/helpers';

const TEXT_HEIGHT = 18;
const BAR_HEIGHT = 16;
const BAR_GROUP_PADDING = 24;
const DATASET_PADDING = 32;
const BAR_GROUP_HEIGHT = TEXT_HEIGHT + BAR_HEIGHT + BAR_GROUP_PADDING;

export default defineComponent({
  components: { LumeBar },
  props: {
    ...withGroupProps(),
  },
  setup(props) {
    const labelRefs = ref<Array<SVGTextElement>>(null);

    const computedXScaleRange = computed(() => {
      if (!labelRefs.value) return;

      const labelWidths = labelRefs.value.map(
        (el) => el.getBoundingClientRect().width
      );

      const maxWidth = Math.max(...labelWidths);
      const domainEdge = Math.max(...props.xScale.range());

      return [0, domainEdge - maxWidth];
    });

    const computedXScale = computed(() => {
      if (!computedXScaleRange.value) return props.xScale;

      const allValues = flatValues(props.data).filter((v) => v != null);
      return scaleLinear()
        .range(computedXScaleRange.value)
        .domain([0, Math.max(...allValues)]);
    });

    function getDatasetY(dataset: InternalDataset, index: number) {
      return (
        index * BAR_GROUP_HEIGHT * dataset.values.length +
        DATASET_PADDING * index
      );
    }

    return {
      BAR_HEIGHT,
      BAR_GROUP_HEIGHT,
      computedXScale,
      DATASET_PADDING,
      getDatasetY,
      TEXT_HEIGHT,
      labelRefs,
    };
  },
});
</script>
