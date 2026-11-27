import { computed } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import {
  actionEventHandlerTemplate,
  captureAction,
  storybookDocsParameter,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import verticalBarChartExample from './__tests__/lume-bar-chart-vertical-example.vue?raw';
import horizontalBarChartExample from './__tests__/lume-bar-chart-horizontal-example.vue?raw';
import missingDataPointsExample from './__tests__/lume-bar-chart-missing-data-points-example.vue?raw';
import groupedBarChartExample from './__tests__/lume-bar-chart-grouped-example.vue?raw';
import stackedBarChartExample from './__tests__/lume-bar-chart-stacked-example.vue?raw';
import customTooltipExample from './__tests__/lume-bar-chart-custom-tooltip-example.vue?raw';
import emptyExample from './__tests__/lume-bar-chart-empty-example.vue?raw';

import LumeBarChart from './index';
import LumeTooltip from '../../core/lume-tooltip/index';

import { ORIENTATIONS } from '@/utils/constants';

import { Colors } from '@/types/utils';

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
  parameters: storybookDocsParameter(verticalBarChartExample),
  render: (args) => ({
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
  parameters: storybookDocsParameter(horizontalBarChartExample),
  render: (args) => ({
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
  parameters: storybookDocsParameter(missingDataPointsExample),
  render: (args) => ({
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
  parameters: storybookDocsParameter(groupedBarChartExample),
  render: (args) => ({
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
  parameters: storybookDocsParameter(stackedBarChartExample),
  render: (args) => ({
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
  parameters: storybookDocsParameter(customTooltipExample),
  render: (args) => ({
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
      return { args, computedColor, customItemsFunction, captureAction };
    },
    template: `
    <div :style="{ width: args.width + 'px', height: args.orientation !== 'horizontal' ? args.height + 'px' : undefined }">
        <lume-bar-chart v-bind="args" :color="computedColor" ${actionEventHandlerTemplate}>
          <template #tooltip = "{ opened, data, hoveredIndex, targetElement }">
            <lume-tooltip :opened="opened" :items="customItemsFunction(data, hoveredIndex)" :target-element="targetElement" position="top"/>
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
  parameters: storybookDocsParameter(emptyExample),
  render: (args) => ({
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
    type: 'grouped',
  },
};
