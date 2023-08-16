import {
  actionEventHandlerTemplate,
  captureAction,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import LumeLineChart from './lume-line-chart.vue';
import LumeTooltip from '../../core/lume-tooltip/index';
import { options as defaultOptions } from './defaults';
import { computed } from 'vue';
import { Colors } from '@/utils/constants';

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
    hoveredIndex: {
      control: 'number',
      description: 'Chart hovered index',
    },
  },
  args: {
    ...withSizeArgs(),
    options: defaultOptions,
    title: 'Line chart',
  },
};

const Template = ({ args }) => ({
  components: { LumeLineChart },
  setup() {
    return { args };
  },
  methods: { captureAction },
  template: `
    <div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-line-chart v-bind="args" ${actionEventHandlerTemplate} />
    </div>
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  ...DATASETS.CatsMetIn2023,
};

export const MultipleDatasets = Template.bind({});
MultipleDatasets.args = {
  ...DATASETS.AnimalsMetIn2023,
};

const CustomTemplate = ({ args }) => ({
  components: { LumeLineChart, LumeTooltip },
  setup() {
    const computedColor = computed(() => Colors[args.color]);
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
    return { args, customItemsFunction, computedColor };
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
  options: {
    yAxisOptions: {
      skip: 2,
    },
    xAxisOptions: {
      skip: 2,
    },
  },
};

export const Empty = Template.bind({});
Empty.args = {
  ...DATASETS.Empty,
};
