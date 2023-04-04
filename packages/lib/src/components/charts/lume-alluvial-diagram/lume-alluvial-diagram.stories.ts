import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
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
    options: Object.fromEntries(
      Object.entries(defaultOptions).filter(
        ([key]) => !key.includes('nodeAlign') && !key.includes('valueFormat')
      )
    ),
    title: 'Alluvial diagram',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A8105',
    },
  },
};

const Template = ({ args }) => {
  return {
    components: { LumeAlluvialDiagram },
    setup() {
      return { args };
    },
    template: `
      <div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-alluvial-diagram v-bind="args" />
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

export const MultipleLevels = Template.bind({});
MultipleLevels.args = {
  ...withSizeArgs(),
  ...DATASETS.MultipleLevels,
};
