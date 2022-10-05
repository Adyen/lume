import DATASETS from '@/docs/storybook-data/base-data';

import LumeChartLegend from './lume-chart-legend.vue';

export default {
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

const Template = ({ argTypes }) => ({
  components: { LumeChartLegend },
  props: Object.keys(argTypes),
  setup(props: InstanceType<typeof LumeChartLegend>['$props']) {
    return { props };
  },
  template: `
    <lume-chart-legend v-bind="props" />
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  data: DATASETS.Single.data,
};

export const MultipleDatasets = Template.bind({});
MultipleDatasets.args = {
  data: DATASETS.Multiple.data,
};
