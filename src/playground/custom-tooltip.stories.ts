import LumeChart from '@/core/lume-chart';
import LumeLineGroup from '@/groups/lume-line-group';

import CustomTooltip from './custom-tooltip.vue';

import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
import { options as defaultOptions } from '@/charts/lume-line-chart/defaults';

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
  components: { LumeChart, LumeLineGroup, CustomTooltip },
  props: Object.keys(argTypes),
  setup() {
    return { args };
  },
  template: `
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <lume-chart v-bind="args">
      <template #groups="props">
        <lume-line-group v-bind="props" />
      </template>
      <template #tooltip="props">
        <custom-tooltip v-bind="props" />
      </template>
    </lume-chart>
  </div>
  `,
});

export const CustomTooltipContent = ({ args, argTypes }) => ({
  components: { LumeChart, LumeLineGroup, CustomTooltip },
  props: Object.keys(argTypes),
  setup() {
    return { args };
  },
  template: `
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <lume-chart v-bind="args">
      <template #groups="props">
        <lume-line-group v-bind="props" />
      </template>
      <template #tooltip-content="{ data, labels, hoveredIndex }">
        On {{ labels[hoveredIndex] }}, the value was <strong>{{ data[0].values[hoveredIndex].value }}</strong>
      </template>
    </lume-chart>
  </div>
  `,
});
CustomTooltipContent.args = {
  options: {
    ...defaultOptions,
    tooltipOptions: { position: 'right-end' },
  },
};
