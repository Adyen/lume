<template>
  <adv-chart
    v-bind="$props"
    :options="allOptions"
  >
    <template #groups="props">
      <adv-alluvial-group v-bind="props" />
    </template>
  </adv-chart>
</template>

<script lang="ts">
import {defineComponent, toRefs} from '@vue/composition-api';
import AdvAlluvialGroup from './adv-alluvial-group/adv-alluvial-group.vue';
import AdvChart from '@/core/adv-chart';
import { withChartProps } from '@/mixins/props';
import { useOptions } from '@/mixins/options';
import { options as defaultOptions} from '@/charts/adv-alluvial-chart/defaults';
import { singleDatasetValidator } from '@/utils/helpers';

export default defineComponent({
  components: { AdvChart, AdvAlluvialGroup },
  props: {
    ...withChartProps(singleDatasetValidator, false)
  },
  setup(props) {
    const { options } = toRefs(props);

    const { allOptions } = useOptions(options, defaultOptions);

    return { allOptions };
  }
});
</script>
