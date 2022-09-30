<template>
  <div style="width: 600px; height: 400px">
    <adv-chart
      :data="combinedData"
      :labels="labels"
      :options="options"
    >
      <template #groups="props">
        <adv-bar-group
          v-bind="props"
          :data="computedBarData"
        />
        <adv-line-group
          v-bind="props"
          :data="computedLineData"
        />
      </template>
    </adv-chart>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';

import AdvChart from '@/core/adv-chart';
import AdvBarGroup from '@/groups/adv-bar-group';
import AdvLineGroup from '@/groups/adv-line-group';

import { useBase } from '@/composables/base';
import { useOptions, withOptions } from '@/composables/options';

import { Data } from '@/types/dataset';

export default defineComponent({
  components: {
    AdvChart,
    AdvLineGroup,
    AdvBarGroup,
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
