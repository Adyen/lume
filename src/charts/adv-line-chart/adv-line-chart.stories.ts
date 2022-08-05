import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';

import AdvLineChart from './adv-line-chart.vue';
import { options as defaultOptions } from './defaults';

import Docs from './adv-line-chart.doc.mdx';

const DATASETS = {
  Single: {
    data: [
      {
        values: [10, 30, 20, 50, 40, 70, 60],
        color: '01',
        label: 'Hamburgers',
      },
    ],
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
  Multiple: {
    data: [
      {
        label: 'Toyota',
        color: '01',
        values: [10, 30, 25, null, 50, 40],
      },
      {
        label: 'Honda',
        color: '02',
        values: [15, 40, 20, -10, 40, 30],
      },
      {
        label: 'Nissan',
        color: '03',
        values: [8, 20, 10, 45, 50, 55],
      },
    ],
    labels: [
      'Jan 2022',
      'Feb 2022',
      'Mar 2022',
      'Apr 2022',
      'May 2022',
      'Jun 2022',
    ],
  },
  'Chargebacks_Fraud overview 28 days': {
    data: [
      {
        values: [
          0.0036, 0.004, 0.0036, 0.0036, 0.0036, 0.0036, 0.0038, 0.0036, 0.0036,
          0.0037, 0.0041, 0.0041, 0.0038, 0.0041, 0.004, 0.0036, 0.0036, 0.0041,
          0.0041, 0.004, 0.0038, 0.0041, 0.0037, 0.0038, 0.0037, 0.0041, 0.0038,
          0.0036,
        ],
        label: 'Chargebacks',
        color: '07',
        sticky: true,
      },
      {
        values: [
          0.0007, 0.0008, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007,
          0.0007, 0.0007, 0.0009, 0.0008, 0.0007, 0.0008, 0.0008, 0.0007,
          0.0007, 0.0009, 0.0008, 0.0008, 0.0007, 0.0009, 0.0007, 0.0007,
          0.0007, 0.0008, 0.0007, 0.0007,
        ],
        label: 'NOFs',
        color: '06',
        sticky: true,
      },
    ],
    labels: [
      'Apr 7',
      'Apr 8',
      'Apr 9',
      'Apr 10',
      'Apr 11',
      'Apr 12',
      'Apr 13',
      'Apr 14',
      'Apr 15',
      'Apr 16',
      'Apr 17',
      'Apr 18',
      'Apr 19',
      'Apr 20',
      'Apr 21',
      'Apr 22',
      'Apr 23',
      'Apr 24',
      'Apr 25',
      'Apr 26',
      'Apr 27',
      'Apr 28',
      'Apr 29',
      'Apr 30',
      'May 1',
      'May 2',
      'May 3',
      'May 4',
    ],
  },
};

export default {
  title: 'Charts/Line chart',
  component: AdvLineChart,
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
  parameters: { docs: { page: Docs } },
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
  data: DATASETS.Single.data,
  labels: DATASETS.Single.labels,
};

export const MultipleDatasets = Template.bind({});
MultipleDatasets.args = {
  data: DATASETS.Multiple.data,
  labels: DATASETS.Multiple.labels,
};

export const RealData = Template.bind({});
RealData.args = {
  data: DATASETS['Chargebacks_Fraud overview 28 days'].data,
  labels: DATASETS['Chargebacks_Fraud overview 28 days'].labels,
  options: {
    ...defaultOptions,
    yAxisOptions: {
      ...defaultOptions.yAxisOptions,
      tickFormat: '~p',
    },
  },
};
