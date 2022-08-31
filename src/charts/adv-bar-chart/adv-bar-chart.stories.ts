import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import AdvBarChart from './index';

import { ORIENTATIONS } from '@/constants';

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
    title: 'Bar chart',
  },
};

const Template = ({ argTypes }) => ({
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
});

export const Basic = Template.bind({});
Basic.args = {
  ...DATASETS.Single,
  orientation: ORIENTATIONS.VERTICAL,
  options: {
    xAxisOptions: {},
    yAxisOptions: {},
  },
};

export const Horizontal = Template.bind({});
Basic.args = {
  ...DATASETS.Single,
  orientation: ORIENTATIONS.HORIZONTAL,
  options: {
    xAxisOptions: {},
    yAxisOptions: {},
  },
};

export const MultipleDatasets = Template.bind({});
MultipleDatasets.argTypes = {
  type: { control: 'radio', options: ['grouped', 'stacked'] },
};
MultipleDatasets.args = {
  ...DATASETS.Multiple,
  type: 'grouped',
  orientation: ORIENTATIONS.VERTICAL,
  options: {
    xAxisOptions: {},
    yAxisOptions: {},
  },
};

export const RealData = Template.bind({});
RealData.args = {
  ...DATASETS['Chargebacks_Fraud overview 28 days'],
  type: 'stacked',
  orientation: ORIENTATIONS.VERTICAL,
  options: {
    xAxisOptions: {},
    yAxisOptions: { tickFormat: '~p' },
  },
};
