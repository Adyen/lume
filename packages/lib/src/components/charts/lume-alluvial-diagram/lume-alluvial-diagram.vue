<template>
  <lume-chart
    v-bind="{ ...props, ...$attrs }"
    :options="getAlluvialDiagramOptions(allOptions)"
    data-j-alluvial-diagram
    v-on="componentEventPropagator"
  >
    <template #groups="groupProps">
      <lume-alluvial-group
        v-bind="groupProps"
        :hovered-element-id="hoveredElement"
        v-on="componentEventPropagator"
      >
        <template
          v-for="(_, name) in groupSlots"
          #[name]="slotData"
        >
          <slot
            :name="name"
            v-bind="slotData || {}"
          />
        </template>
      </lume-alluvial-group>
    </template>
    <template
      v-for="(_, name) in slots"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData || {}"
      />
    </template>
  </lume-chart>
</template>

<script setup lang="ts">
import { toRefs, useSlots } from 'vue';

import LumeChart from '@/components/core/lume-chart';
import LumeAlluvialGroup from '@/components/groups/lume-alluvial-group';

import { useEvents } from '@/composables/events';
import { withDiagramProps } from '@/composables/props';
import { useOptions } from '@/composables/options';

import type { ChartEmits } from '@/types/events';
import type { AlluvialDiagramOptions } from '@/types/options';

import {
  excludeChartSlots,
  excludeGroups,
  singleDatasetValidator,
} from '@/utils/helpers';

import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withDiagramProps<AlluvialDiagramOptions>(singleDatasetValidator),
});

// https://github.com/vuejs/core/issues/4294#issuecomment-1480392140
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Emits extends ChartEmits {}
const emit = defineEmits<Emits>();

const { componentEventPropagator } = useEvents(emit);

const slots = excludeGroups(useSlots());
const groupSlots = excludeChartSlots(useSlots());

const { options } = toRefs(props);

const { allOptions } = useOptions(options, defaultOptions);

function getAlluvialDiagramOptions(options: AlluvialDiagramOptions) {
  return {
    ...options,
    noBaseScales: true, // Alluvial chart never uses base scales
  };
}
</script>
