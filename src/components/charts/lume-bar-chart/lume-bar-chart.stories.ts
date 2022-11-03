import { computed } from 'vue';
import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import LumeBarChart from './index';

import { Colors, ORIENTATIONS } from '@/constants';

export default {
  title: 'Charts/Bar chart',
  component: LumeBarChart,
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
    color: {
      control: 'select',
      options: Object.keys(Colors),
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
  components: { LumeBarChart },
  props: Object.keys(argTypes),
  setup(props) {
    const computedColor = computed(() => Colors[props.color]);
    return { computedColor, props };
  },
  template: `
  <div :style="{ width: width + 'px', height: props.orientation !== 'horizontal' ? height + 'px' : undefined }">
      <lume-bar-chart v-bind="props" :color="computedColor" />
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
Basic.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A3148',
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
MultipleDatasets.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A5994',
  },
};

export const MaximumDatasets = Template.bind({});
MaximumDatasets.argTypes = {
  type: { control: 'radio', options: ['grouped', 'stacked'] },
};
MaximumDatasets.args = {
  ...withSizeArgs(720),
  ...DATASETS.Maximum,
  type: 'grouped',
  orientation: ORIENTATIONS.VERTICAL,
  options: {
    xAxisOptions: {},
    yAxisOptions: { tickFormat: '.2s' },
  },
};
MaximumDatasets.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A5994',
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
RealData.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A7280',
  },
};
