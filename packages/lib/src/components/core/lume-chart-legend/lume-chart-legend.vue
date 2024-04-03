<template>
  <div
    class="lume-chart-legend"
    data-j-chart-legend
    @mouseleave="emit('mouseleave')"
  >
    <div
      v-for="(dataset, index) in data"
      :key="`legend-item-${index}`"
      class="lume-chart-legend__item lume-typography--body"
      tabindex="0"
      data-j-chart-legend__symbol-wrapper
      @click="emit('click', { index, dataset, event: $event })"
      @mouseenter="emit('mouseenter', { index, dataset, event: $event })"
    >
      <span
        class="lume-chart-legend__symbol"
        :class="`lume-background-color--${dataset.color}`"
        data-j-chart-legend__symbol
      />
      {{ dataset.label || index }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { InternalData } from '@/types/dataset';
import type { LegendEventPayload } from '@/types/events';
import { dataValidator } from '@/utils/helpers';

defineProps({
  data: {
    type: Array as PropType<InternalData>,
    validator: dataValidator,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'click' | 'mouseenter', p: LegendEventPayload): void;
  (e: 'mouseleave'): void;
}>();
</script>

<style lang="scss" scoped>
@use './styles';
</style>
