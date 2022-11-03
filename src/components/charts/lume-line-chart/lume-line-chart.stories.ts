import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import LumeLineChart from './lume-line-chart.vue';
import { options as defaultOptions } from './defaults';

export default {
  title: 'Charts/Line chart',
  component: LumeLineChart,
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
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A6671',
    },
  },
};

const Template = ({ argTypes }) => ({
  components: { LumeLineChart },
  props: Object.keys(argTypes),
  setup(props: InstanceType<typeof LumeLineChart>['$props']) {
    return { props };
  },
  template: `
    <div :style="{ width: width + 'px', height: height + 'px' }">
        <lume-line-chart v-bind="props" :data="data" :labels="labels" />
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
