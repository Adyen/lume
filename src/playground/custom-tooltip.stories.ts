import AdvChart from '@/core/adv-chart';
import AdvLineGroup from '@/groups/adv-line-group';

import CustomTooltip from './custom-tooltip.vue';

import { withSizeArgTypes, withSizeArgs } from '@/utils/storybook-helpers';
import { options as defaultOptions } from '@/charts/adv-line-chart/defaults';

export default {
  title: 'Playground/Custom tooltip',
  component: CustomTooltip,
  argTypes: {
    ...withSizeArgTypes(),
  },
  args: {
    ...withSizeArgs(),
    options: defaultOptions,
    data: [
      {
        values: [20, 50, 30, 35, 10, 50, 30],
        color: '02',
        label: 'Emojis',
        type: 'line',
      },
    ],
    labels: [
      'Mar 2022',
      'Apr 2022',
      'May 2022',
      'Jun 2022',
      'Jul 2022',
      'Aug 2022',
      'Sep 2022',
    ],
  },
};

export const CustomTooltipElement = ({ args, argTypes }) => ({
  components: { AdvChart, AdvLineGroup, CustomTooltip },
  props: Object.keys(argTypes),
  setup() {
    return { args };
  },
  template: `
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <adv-chart v-bind="args">
      <template #groups="props">
        <adv-line-group v-bind="props" />
      </template>
      <template #tooltip="props">
        <custom-tooltip v-bind="props" />
      </template>
    </adv-chart>
  </div>
  `,
});

export const CustomTooltipContent = ({ args, argTypes }) => ({
  components: { AdvChart, AdvLineGroup, CustomTooltip },
  props: Object.keys(argTypes),
  setup() {
    return { args };
  },
  template: `
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <adv-chart v-bind="args">
      <template #groups="props">
        <adv-line-group v-bind="props" />
      </template>
      <template #tooltip-content="{ data, labels, hoveredIndex }">
        On {{ labels[hoveredIndex] }}, the value was <strong>{{ data[0].values[hoveredIndex].value }}</strong>
      </template>
    </adv-chart>
  </div>
  `,
});
CustomTooltipContent.args = {
  options: {
    ...defaultOptions,
    tooltipOptions: { position: 'right-end' },
  },
};
