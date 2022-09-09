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
          :data="barData"
        />
        <adv-line-group
          v-bind="props"
          :data="lineData"
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

import { useOptions, withOptions } from '@/mixins/options';

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
    const { options } = toRefs(props);

    const combinedData = computed(() => [...props.lineData, ...props.barData]);

    const { allOptions } = useOptions(options);

    return {
      combinedData,
      allOptions,
    };
  },
});
</script>

<style lang="scss" scoped></style>
