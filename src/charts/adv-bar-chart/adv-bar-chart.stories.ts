import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';

import AdvBarChart from './index';

import { ORIENTATIONS } from '@/constants';

const labels = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default {
  title: 'Charts/Bar chart',
  component: AdvBarChart,
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
    orientation: {
      control: 'radio',
      options: [ORIENTATIONS.VERTICAL, ORIENTATIONS.HORIZONTAL],
    },
    options: {
      control: 'object',
      description: 'Chart/axes options.',
    },
    title: {
      control: 'text',
      description: 'Chart title',
    },
  },
  args: {
    ...withSizeArgs(),
    options: {},
  },
};

export const SingleBarChart = ({ argTypes }) => {
  return {
    components: { AdvBarChart },
    props: Object.keys(argTypes),
    setup(props) {
      return { props };
    },
    template: `
    <div :style="{ width: width + 'px', height: props.orientation !== 'horizontal' ? height + 'px' : undefined }">
        <adv-bar-chart v-bind="props" />
    </div>
  `,
  };
};
SingleBarChart.args = {
  data: [
    {
      values: [30, -10, 20, 70, 50, null, 40],
      color: '02',
      label: 'Hot dogs',
    },
  ],
  labels,
  orientation: ORIENTATIONS.VERTICAL,
  options: {
    xAxisOptions: {},
    yAxisOptions: {},
  },
  title: 'Hot dog sales per weekday',
};

export const MultiBarChart = ({ argTypes }) => {
  return {
    components: { AdvBarChart },
    props: Object.keys(argTypes),
    setup(props) {
      return { props };
    },
    template: `
    <div :style="{ width: width + 'px', height: props.orientation !== 'horizontal' ? height + 'px' : undefined }">
        <adv-bar-chart v-bind="props" />
    </div>
  `,
  };
};
MultiBarChart.argTypes = {
  type: { control: 'radio', options: ['grouped', 'stacked'] },
};
MultiBarChart.args = {
  type: 'grouped',
  data: [
    {
      values: [10, 30, -20, 50, -10, 70, 60],
      color: '01',
      label: 'Hamburgers',
    },
    {
      values: [30, 10, 20, 70, -20, null, 40],
      color: '02',
      label: 'Hot dogs',
    },
    {
      values: [10, 40, 70, 60, 10, 5, 10],
      color: '03',
      label: 'Kebabs',
    },
  ],
  labels,
  orientation: ORIENTATIONS.VERTICAL,
  options: {
    xAxisOptions: {},
    yAxisOptions: {},
  },
  title: 'Snack sales per weekday',
};
