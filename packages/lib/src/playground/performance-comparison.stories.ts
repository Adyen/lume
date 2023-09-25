import LumeChart from '@/components/core/lume-chart';

import PerformanceComparison from './performance-comparison.vue';

import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';

export default {
  title: 'Playground/Performance Comparison',
  component: PerformanceComparison,
  argTypes: {
    ...withSizeArgTypes(),
  },
  args: {
    ...withSizeArgs(720),
  },
};

export const Basic = ({ args }) => {
  return {
    components: { LumeChart, PerformanceComparison },
    setup() {
      return { args };
    },
    template: `
      <div :style="{ width: args.width + 'px' }">
          <lume-chart
            v-bind="args"
            :data="[args.data[0]]"
            :title="args.data[0].label"
            style="height: 182px"
            orientation="horizontal"
          >
            <template #groups="groupProps">
              <performance-comparison v-bind="groupProps" />
            </template>
          </lume-chart>

          <lume-chart
            v-bind="args"
            :data="[args.data[1]]"
            :title="args.data[1].label"
            style="height: 182px"
            orientation="horizontal"
          >
            <template #groups="groupProps">
              <performance-comparison v-bind="groupProps" />
            </template>
          </lume-chart>
      </div>
    `,
  };
};
Basic.args = {
  data: [
    {
      label: 'Shoppers count',
      values: [
        { value: 111973, color: '03' },
        { value: 76252, percentage: -32, color: '04' },
      ],
    },
    {
      label: 'Average transaction value',
      values: [
        { value: 4002, color: '03' },
        { value: 5654, percentage: 41, color: '04' },
      ],
    },
  ],
  labels: ['Aug 29 - Oct 2, 2022', 'Oct 3 - Nov 6, 2022'],
  options: {
    withAxes: false,
    withLegend: false,
    withHover: false,
    noMinSize: true,
    startOnZero: true,
  },
};
