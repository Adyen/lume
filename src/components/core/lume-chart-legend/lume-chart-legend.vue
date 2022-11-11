<template>
  <div
    class="lume-chart-legend"
    data-j-chart-legend
  >
    <div
      v-for="(dataset, index) in data"
      :key="`legend-item-${index}`"
      class="lume-chart-legend__item lume-typography--body"
      tabindex="0"
      data-j-chart-legend__symbol-wrapper
      @click="$emit('click', index)"
    >
      <span
        class="lume-chart-legend__symbol"
        :class="`lume-background-color--${dataset.color}`"
        data-j-chart-legend__symbol
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
