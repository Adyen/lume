import { toRefs } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import DATASETS from '@/docs/storybook-data/base-data';

import LumeChartLegend from './lume-chart-legend.vue';

import { useBase } from '../../../composables/base';

const meta: Meta<typeof LumeChartLegend> = {
  title: 'Core/Legend',
  component: LumeChartLegend,
  argTypes: {
    data: {
      control: 'object',
      description: 'Chart data.',
    },
  },
  args: {},
};

export default meta;

type Story = StoryObj<typeof LumeChartLegend>;

export const Basic: Story = {
  render: ({ args }) => ({
    components: { LumeChartLegend },
    setup() {
      const { data, labels } = toRefs(args);
      const { internalData } = useBase(data, labels);
      return { args, internalData };
    },
    template: `<lume-chart-legend v-bind="args" :data="internalData" />`,
  }),
  args: {
    data: DATASETS.Single.data,
  },
};

export const MultipleDatasets: Story = {
  render: ({ args }) => ({
    components: { LumeChartLegend },
    setup() {
      const { data, labels } = toRefs(args);
      const { internalData } = useBase(data, labels);
      return { args, internalData };
    },
    template: `<lume-chart-legend v-bind="args" :data="internalData" />`,
  }),
  args: {
    data: DATASETS.AdoptedAnimals.data,
  },
};
