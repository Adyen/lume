<template>
  <AdvBarChart v-bind="$props" />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import AdvBarChart from '@/charts/adv-bar-chart';

import { withChartProps } from '@/mixins/props';

export default defineComponent({
  components: { AdvBarChart },
  props: {
    ...withChartProps(),
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss"></style>
