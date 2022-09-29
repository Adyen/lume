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
      @click="emit('click', index)"
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

<script setup lang="ts">
import { PropType } from 'vue';
import { Data, DatasetValueObject } from '@/types/dataset';

defineProps({
  data: {
    type: Array as PropType<
        Array<Pick<DatasetValueObject, 'color' | 'label'>>
      >,
    validator: (datasets: Data) =>
      !!datasets &&
        datasets.every((dataset) => 'color' in dataset && 'label' in dataset),
    required: true,
  },
});

const emit = defineEmits(['click']);
</script>

<style lang="scss" scoped>
@use './styles';
</style>