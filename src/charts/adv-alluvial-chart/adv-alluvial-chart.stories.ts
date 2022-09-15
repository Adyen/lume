import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import DATASETS from '@/docs/storybook-data/alluvial-data';

import AdvAlluvialChart from './adv-alluvial-chart.vue';
import { options as defaultOptions } from './defaults';

export default {
  title: 'Charts/Alluvial chart',
  component: AdvAlluvialChart,
  argTypes: {
    ...withSizeArgTypes(),
    data: {
      control: 'object',
      description: 'Chart data.',
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
    title: 'Alluvial chart',
  },
};

const Template = ({ argTypes }) => {
  return {
    components: { AdvAlluvialChart },
    props: Object.keys(argTypes),
    setup(props) {
      return { props };
    },
    template: `
      <div :style="{ width: width + 'px', height: height + 'px' }">
        <adv-alluvial-chart v-bind="props" :data="data" />
      </div>
  `,
  };
};

export const Basic = Template.bind({});
Basic.args = {
  ...DATASETS.Basic,
};

export const RealData = Template.bind({});
RealData.args = {
  ...withSizeArgs(920, 460),
  ...DATASETS.RealData,
};
