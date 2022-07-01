<template>
  <g class="line-chart__line-group">
    <g class="line-chart__lines">
      <chart-line
        v-for="(_, index) in values"
        :key="`line-${index}`"
        :x-scale="xScale"
        :y-scale="yScale"
        :values="getLineValues(index)"
        :index="index"
        :color="color"
        :dashed="isDashed(index)"
      />
    </g>
    <g class="line-chart__points">
      <line-point
        v-for="(_, index) in values"
        :key="`point-${index}`"
        ref="points"
        :x-scale="xScale"
        :y-scale="yScale"
        :value="getPointValue(index)"
        :index="index"
        :color="color"
        :active="isPointActive(index)"
      />
    </g>
  </g>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  toRefs,
} from '@vue/composition-api';

import ChartLine from './chart-line.vue';
import LinePoint from './line-point.vue';

import { useLineNullValues } from '@/mixins/line-null-values';
import { DatasetValueObject } from '@/types/dataset';

export default defineComponent({
  components: { ChartLine, LinePoint },
  props: {
    values: {
      type: Array as PropType<Array<DatasetValueObject<number>>>,
      required: true,
    },
    color: {
      type: String,
      default: '01',
    },
    label: {
      type: String,
      default: '',
    },
    hoveredIndex: {
      type: Number,
      default: -1,
    },
    xScale: {
      type: Function,
      required: true,
    },
    yScale: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    const { values } = toRefs(props);
    const { nullIntervals, getMidValue, isDashed } = useLineNullValues(values);

    const points = ref<Array<InstanceType<typeof LinePoint>>>(null);

    const computedLineValues = computed(() => {
      return props.values.map((value, index) => {
        const nullInterval = nullIntervals.value.find((interval) =>
          interval.includes(index)
        );
        if (nullInterval) {
          let start = props.values[nullInterval[0] - 1].value;
          let end = props.values[nullInterval.at(-1) + 1].value;

          // If first/last value is `null`, use the first/last non-null value
          if (start == null) start = end;
          if (end == null) end = start;

          return {
            value: getMidValue(
              start,
              end,
              nullInterval.length,
              nullInterval.indexOf(index)
            ),
          };
        }
        return value;
      });
    });

    function getLineValues(index: number) {
      // First value
      if (index === 0) return [];

      return [
        computedLineValues.value[index - 1]?.value,
        computedLineValues.value[index]?.value,
      ];
    }

    function getPointValue(index: number) {
      return computedLineValues.value[index]?.value;
    }

    function isPointActive(index: number) {
      return props.hoveredIndex === index;
    }

    function getPointByIndex(index: number) {
      return points.value[index];
    }

    return {
      points,
      isDashed,
      getLineValues,
      getPointValue,
      isPointActive,
      getPointByIndex,
    };
  },
});
</script>
