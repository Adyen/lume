import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import AdvLineChart from './adv-line-chart.vue';
import { options as defaultOptions } from './defaults';

import ReadMe from './README.md';

export default {
  title: 'Charts/Line chart',
  component: AdvLineChart,
  parameters: {
    docs: {
      page: ReadMe,
    },
  },
  argTypes: {
    ...withSizeArgTypes(),
    data: {
      control: 'object',
      description: 'Chart data.',
    },
    labels: {
      control: 'object',
      description: 'Chart labels.',
    },
    options: {
      control: 'object',
      description: 'Chart/axes options.',
    },
    title: {
      control: 'text',
      description: 'Chart title.',
    },
  },
  args: {
    ...withSizeArgs(),
    options: defaultOptions,
    title: 'Line chart',
  },
};

const Template = ({ argTypes }) => ({
  components: { AdvLineChart },
  props: Object.keys(argTypes),
  setup(props: InstanceType<typeof AdvLineChart>['$props']) {
    return { props };
  },
  template: `
    <div :style="{ width: width + 'px', height: height + 'px' }">
        <adv-line-chart v-bind="props" :data="data" :labels="labels" />
    </div>
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  ...DATASETS.Single,
};

export const MultipleDatasets = Template.bind({});
MultipleDatasets.args = {
  ...DATASETS.Multiple,
};

export const RealData = Template.bind({});
RealData.args = {
  ...DATASETS['Chargebacks_Fraud overview 28 days'],
  options: {
    ...defaultOptions,
    yAxisOptions: {
      ...defaultOptions.yAxisOptions,
      tickFormat: '~p',
    },
  },
};
