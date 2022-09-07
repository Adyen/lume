import DATASETS from '@/docs/storybook-data/base-data';

import AdvChartLegend from './adv-chart-legend.vue';

export default {
  title: 'Core/Legend',
  component: AdvChartLegend,
  argTypes: {
    data: {
      control: 'object',
      description: 'Chart data.',
    },
  },
  args: {},
};

const Template = ({ argTypes }) => ({
  components: { AdvChartLegend },
  props: Object.keys(argTypes),
  setup(props: InstanceType<typeof AdvChartLegend>['$props']) {
    return { props };
  },
  template: `
    <adv-chart-legend v-bind="props" />
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
