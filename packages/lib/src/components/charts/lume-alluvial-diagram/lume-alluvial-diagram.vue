<template>
  <lume-chart
    v-bind="props"
    :options="getAlluvialDiagramOptions(allOptions)"
    data-j-alluvial-diagram
  >
    <template #groups="groupProps">
      <lume-alluvial-group
        v-bind="groupProps"
        :hovered-element-id="hoveredElement"
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

import { withDiagramProps } from '@/composables/props';
import { AlluvialDiagramOptions, useOptions } from '@/composables/options';

import {
  excludeChartSlots,
  excludeGroups,
  singleDatasetValidator,
} from '@/utils/helpers';
import { options as defaultOptions } from './defaults';

const props = defineProps({
  ...withDiagramProps<AlluvialDiagramOptions>(singleDatasetValidator),
});

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
