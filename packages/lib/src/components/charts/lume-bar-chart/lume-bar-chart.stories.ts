import { computed } from 'vue';

import {
  actionEventHandlerTemplate,
  captureAction,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import LumeBarChart from './index';
import LumeTooltip from '../../core/lume-tooltip/index';

import { Colors, ORIENTATIONS } from '@/utils/constants';

// const tickFormat = {
//   'charts-bar-chart--maximum-datasets': '.2s',
//   'charts-bar-chart--real-data': '~s',
// };

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
    hoveredIndex: {
      control: 'number',
      description: 'Chart hovered index',
    },
  },
  args: {
    ...withSizeArgs(),
    options: {},
    title: 'Bar chart',
  },
};

const Template = ({ args }) => ({
  components: { LumeBarChart },
  setup() {
    const computedColor = computed(() => Colors[args.color]);
    return { args, computedColor };
  },
  methods: { captureAction },
  template: `
  <div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
      <lume-bar-chart v-bind="args" :color="computedColor" ${actionEventHandlerTemplate} />
  </div>
  `,
});

const CustomTemplate = ({ args }) => ({
  components: { LumeBarChart, LumeTooltip },
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
    return { args, computedColor, customItemsFunction };
  },
  template: `
  <div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
      <lume-bar-chart v-bind="args" :color="computedColor">
        <template #tooltip = "{ data, hoveredIndex, targetElement }">
          <lume-tooltip :items="customItemsFunction(data, hoveredIndex)" :target-element="targetElement" position="top"/>
        </template>
      </lume-bar-chart>
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
};
MaximumDatasets.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A5994',
  },
};

export const RealData = Template.bind({});
RealData.args = {
  ...DATASETS['Adoption rate overview 28 days'],
  type: 'stacked',
  orientation: ORIENTATIONS.VERTICAL,
  options: {
    yAxisOptions: {},
  },
};
RealData.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A7280',
  },
};

export const CustomTooltip = CustomTemplate.bind({});
CustomTooltip.args = {
  ...DATASETS.Single,
  orientation: ORIENTATIONS.VERTICAL,
  options: {
    xAxisOptions: {},
    yAxisOptions: {},
  },
};
CustomTooltip.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A3148',
  },
};

export const Empty = Template.bind({});
Empty.args = {
  ...DATASETS.Empty,
};
Empty.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A3148',
  },
};
