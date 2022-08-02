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
@use '~@/styles/variables' as *;

.adv-chart-legend {
  display: flex;
  justify-items: end;

  &__item {
    display: flex;
    align-items: center;

    padding: 0.25rem 0.5rem;
    gap: 0.25rem;

    font-family: $adv-font-family;
    font-size: $adv-text-font-size-small;

    cursor: default;
  }

  &__circle {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;

    border-radius: 50%;

    @each $color, $map in $chart-colors {
      &--color-#{$color} {
        background-color: nth($map, 1);
      }
    }
  }
}
</style>
