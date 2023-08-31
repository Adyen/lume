import { computed, toRaw } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import {
  actionEventHandlerTemplate,
  captureAction,
  COLOR_CLASS_MAP,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/sparkline-data';

import LumeSparklineChart from './lume-sparkline-chart.vue';

const meta: Meta<typeof LumeSparklineChart> = {
  title: 'Charts/Sparkline chart',
  component: LumeSparklineChart,
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
    color: {
      control: 'select',
      options: Object.keys(COLOR_CLASS_MAP),
      description: 'Line color',
    },
    areaColor: {
      control: 'select',
      options: Object.keys(COLOR_CLASS_MAP),
      description: 'Line color',
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
    ...withSizeArgs(300, 80),
  },
};

export default meta;

type Story = StoryObj<typeof LumeSparklineChart>;

export const Basic: Story = {
  render: ({ args }) => ({
    components: { LumeSparklineChart },
    setup() {
      const computedData = computed(() => {
        const dataset = structuredClone(toRaw(args.data)); // Deep copy dataset array
        if (args.color) dataset[0].color = COLOR_CLASS_MAP[args.color];
        if (args.areaColor)
          dataset[0].areaColor = COLOR_CLASS_MAP[args.areaColor];
        return dataset;
      });

      return { args, computedData, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-sparkline-chart v-bind="args" :data="computedData" ${actionEventHandlerTemplate} />
    </div>`,
  }),
  args: {
    ...DATASETS.Basic,
  },
};

export const NegativeValues: Story = {
  render: ({ args }) => ({
    components: { LumeSparklineChart },
    setup() {
      const computedData = computed(() => {
        const dataset = structuredClone(toRaw(args.data)); // Deep copy dataset array
        if (args.color) dataset[0].color = COLOR_CLASS_MAP[args.color];
        if (args.areaColor)
          dataset[0].areaColor = COLOR_CLASS_MAP[args.areaColor];
        return dataset;
      });

      return { args, computedData, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-sparkline-chart v-bind="args" :data="computedData" ${actionEventHandlerTemplate} />
    </div>`,
  }),
  args: {
    ...DATASETS.NegativeValue,
  },
};

export const NullValues: Story = {
  render: ({ args }) => ({
    components: { LumeSparklineChart },
    setup() {
      const computedData = computed(() => {
        const dataset = structuredClone(toRaw(args.data)); // Deep copy dataset array
        if (args.color) dataset[0].color = COLOR_CLASS_MAP[args.color];
        if (args.areaColor)
          dataset[0].areaColor = COLOR_CLASS_MAP[args.areaColor];
        return dataset;
      });

      return { args, computedData, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-sparkline-chart v-bind="args" :data="computedData" ${actionEventHandlerTemplate} />
    </div>`,
  }),
  args: {
    ...DATASETS.NullValues,
  },
};

export const Empty: Story = {
  render: ({ args }) => ({
    components: { LumeSparklineChart },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-sparkline-chart v-bind="args"  ${actionEventHandlerTemplate} />
    </div>`,
  }),
  args: {
    ...DATASETS.Empty,
  },
};
