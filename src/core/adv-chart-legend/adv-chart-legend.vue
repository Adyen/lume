<template>
  <div class="adv-chart-legend">
    <div
      v-for="(dataset, index) in data"
      :key="`legend-item-${index}`"
      class="adv-chart-legend__item"
      tabindex="0"
    >
      <span
        class="adv-chart-legend__circle"
        :class="`adv-chart-legend__circle--color-${dataset.color}`"
      />
      {{ dataset.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { Data, DatasetValueObject } from '@/types/dataset';

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<Data<DatasetValueObject>>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
@use './styles';
</style>
