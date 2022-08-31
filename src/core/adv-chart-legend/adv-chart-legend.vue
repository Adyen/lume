<template>
  <div
    class="adv-chart-legend"
    data-j-chart-legend
  >
    <div
      v-for="(dataset, index) in data"
      :key="`legend-item-${index}`"
      class="adv-chart-legend__item"
      tabindex="0"
    >
      <span
        class="adv-chart-legend__circle"
        :class="`adv-background-color--${dataset.color}`"
        data-j-chart-legend__circle
      />
      {{ dataset.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Data, DatasetValueObject } from '@/types/dataset';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<Data<DatasetValueObject>>,
      validator: (datasets: Data) =>
        !!datasets && datasets.every((dataset) => 'color' in dataset),
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
