import { computed } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

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

const meta: Meta<typeof LumeBarChart> = {
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
  },
};

export default meta;

type Story = StoryObj<typeof LumeBarChart>;

export const VerticalBarChart: Story = {
  render: ({ args }) => ({
    components: { LumeBarChart },
    setup() {
      const computedColor = computed(() => Colors[args.color]);
      return { args, computedColor, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
        <lume-bar-chart v-bind="args" :color="computedColor" ${actionEventHandlerTemplate} />
      </div>`,
  }),
  args: {
    ...DATASETS.Single,
    orientation: ORIENTATIONS.VERTICAL,
    options: {
      xAxisOptions: {
        skip: 1,
      },
    },
  },
};

export const HorizontalBarChart: Story = {
  render: ({ args }) => ({
    components: { LumeBarChart },
    setup() {
      const computedColor = computed(() => Colors[args.color]);
      return { args, computedColor, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
        <lume-bar-chart v-bind="args" :color="computedColor" ${actionEventHandlerTemplate} />
      </div>`,
  }),
  args: {
    ...DATASETS.LifeExpectancy,
    orientation: ORIENTATIONS.HORIZONTAL,
  },
};

export const MissingDataPoints: Story = {
  render: ({ args }) => ({
    components: { LumeBarChart },
    setup() {
      const computedColor = computed(() => Colors[args.color]);
      return { args, computedColor, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
        <lume-bar-chart v-bind="args" :color="computedColor" ${actionEventHandlerTemplate} />
      </div>`,
  }),
  args: {
    ...DATASETS.MissingDataPoints,
    orientation: ORIENTATIONS.VERTICAL,
    options: {
      tooltipOptions: {
        valueFormat: (value) => (value !== 'No data' ? `EUR ${value}` : value),
      },
      withLegend: false,
    },
    title: 'Money spent on cats',
  },
};

export const GroupedBarChart: Story = {
  render: ({ args }) => ({
    components: { LumeBarChart },
    setup() {
      const computedColor = computed(() => Colors[args.color]);
      return { args, computedColor, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
        <lume-bar-chart v-bind="args" :color="computedColor" ${actionEventHandlerTemplate} />
      </div>`,
  }),
  args: {
    ...DATASETS.AdoptedAnimals,
    type: 'grouped',
    orientation: ORIENTATIONS.VERTICAL,
  },
};

export const StackedBarChart: Story = {
  render: ({ args }) => ({
    components: { LumeBarChart },
    setup() {
      const computedColor = computed(() => Colors[args.color]);
      return { args, computedColor, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
        <lume-bar-chart v-bind="args" :color="computedColor" ${actionEventHandlerTemplate} />
      </div>`,
  }),
  args: {
    ...DATASETS.WeeklyAnimalEncounter,
    type: 'stacked',
    orientation: ORIENTATIONS.VERTICAL,
  },
};

export const CustomTooltip: Story = {
  render: ({ args }) => ({
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
              value: `${values[hoveredIndex].value ?? 0} years`,
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
          <template #tooltip = "{ opened, data, hoveredIndex, targetElement }">
            <lume-tooltip v-if="opened" :items="customItemsFunction(data, hoveredIndex)" :target-element="targetElement" position="top"/>
          </template>
        </lume-bar-chart>
    </div>
    `,
  }),
  args: {
    ...DATASETS.LifeExpectancy,
    orientation: ORIENTATIONS.VERTICAL,
  },
};

export const Empty: Story = {
  render: ({ args }) => ({
    components: { LumeBarChart },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
        <lume-bar-chart v-bind="args" ${actionEventHandlerTemplate}  />
      </div>`,
  }),
  args: {
    ...DATASETS.Empty,
  },
};
