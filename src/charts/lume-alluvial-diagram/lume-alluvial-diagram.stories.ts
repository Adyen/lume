import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import DATASETS from '@/docs/storybook-data/alluvial-data';

import LumeAlluvialDiagram from './lume-alluvial-diagram.vue';
import { options as defaultOptions } from './defaults';

export default {
  title: 'Charts/Alluvial diagram',
  component: LumeAlluvialDiagram,
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
    title: 'Alluvial diagram',
  },
};

const Template = ({ argTypes }) => {
  return {
    components: { LumeAlluvialDiagram },
    props: Object.keys(argTypes),
    setup(props) {
      return { props };
    },
    template: `
      <div :style="{ width: width + 'px', height: height + 'px' }">
        <lume-alluvial-diagram v-bind="props" :data="data" />
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
