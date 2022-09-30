import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import LumeBarChart from './index';

import { ORIENTATIONS } from '@/constants';

const Template = ({ argTypes }) => ({
  components: { LumeBarChart },
  props: Object.keys(argTypes),
  setup(props) {
    return { props };
  },
  template: `
  <div :style="{ width: width + 'px', height: props.orientation !== 'horizontal' ? height + 'px' : undefined }">
      <lume-bar-chart v-bind="props" />
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
