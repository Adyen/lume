import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import LumeLineChart from './lume-line-chart.vue';
import LumeTooltip from '../../core/lume-tooltip/index';
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

const Template = ({ args }) => ({
  components: { LumeLineChart },
  setup() {
    return { args };
  },
  template: `
    <div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-line-chart v-bind="args" />
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
  ...DATASETS['Adoption rate overview 28 days'],
  options: {
    ...defaultOptions,
    yAxisOptions: {
      ...defaultOptions.yAxisOptions,
    },
  },
};

const CustomTemplate = ({ args }) => ({
  components: { LumeLineChart, LumeTooltip },
  setup() {
    const customItemsFunction = (data, hoveredIndex) => {
      if (hoveredIndex > -1) {
        const { color, label, values } = data[0];
        return [
          {
            color,
            label,
            value: values[hoveredIndex].value ?? 0,
          },
        ];
      }
      return [];
    };
    return { args, customItemsFunction };
  },
  template: `
  <div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
  <lume-line-chart v-bind="args" :color="computedColor">
    <template #tooltip = "{ data, hoveredIndex, targetElement }">
      <lume-tooltip :items="customItemsFunction(data, hoveredIndex)" :target-element="targetElement" position="top"/>
    </template>
  </lume-line-chart>
</div>
  `,
});

export const CustomTooltip = CustomTemplate.bind({});
CustomTooltip.args = {
  ...DATASETS.Single,
};
