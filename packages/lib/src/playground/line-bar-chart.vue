<template>
  <div style="width: 600px; height: 400px">
    <lume-chart
      :data="combinedData"
      :labels="labels"
      :options="options"
    >
      <template #groups="props">
        <lume-bar-group
          v-bind="props"
          :data="computedBarData"
        />
        <lume-line-group
          v-bind="props"
          :data="computedLineData"
        />
      </template>
    </lume-chart>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeBarGroup from '@/components/groups/lume-bar-group';
import LumeLineGroup from '@/components/groups/lume-line-group';

import { useBase } from '@/composables/base';
import { useOptions, withOptions } from '@/composables/options';

import type { Data } from '@/types/dataset';

export default defineComponent({
  components: {
    LumeChart,
    LumeLineGroup,
    LumeBarGroup,
  },
  props: {
    barData: {
      type: Array as PropType<Data>,
      required: true,
    },
    lineData: {
      type: Array as PropType<Data>,
      required: true,
    },
    labels: {
      type: Array as PropType<Array<string>>,
      default: (): Array<string> | null => null,
    },
    ...withOptions(),
  },
  setup(props) {
    const { barData, lineData, options } = toRefs(props);

    const computedBarData = useBase(barData).internalData;
    const computedLineData = useBase(lineData).internalData;

    const combinedData = computed(() => [
      ...computedBarData.value,
      ...computedLineData.value,
    ]);

    const { allOptions } = useOptions(options);

    return { computedBarData, computedLineData, combinedData, allOptions };
  },
});
</script>

<style lang="scss" scoped></style>
