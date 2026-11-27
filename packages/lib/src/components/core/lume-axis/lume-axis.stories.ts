import type { Meta, StoryObj } from '@storybook/vue3';
import { computed } from 'vue';
import { scaleBand, scaleLinear } from 'd3';

import {
  storybookDocsParameter,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';

import LumeAxis from './lume-axis.vue';
import xAxisExample from './__tests__/lume-axis-x-axis-example.vue?raw';
import yAxisExample from './__tests__/lume-axis-y-axis-example.vue?raw';
import yAxisTickAlignStartExample from './__tests__/lume-axis-y-axis-tick-align-start-example.vue?raw';
import bothAxesExample from './__tests__/lume-axis-both-axes-example.vue?raw';
import { xOptions, yOptions } from './defaults';

const SCALES = {
  band: scaleBand().domain(['0', '1', '2', '3', '4', '5', '6']),
  linear: scaleLinear().domain([0, 100]),
};

const meta: Meta<typeof LumeAxis> = {
  title: 'Core/Axis',
  component: LumeAxis,
  argTypes: {
    ...withSizeArgTypes(),
    options: {
      control: 'object',
      description: 'Axis options.',
    },
  },
  args: {
    ...withSizeArgs(540, 200),
  },
};

export default meta;

type Story = StoryObj<typeof LumeAxis>;

export const xAxis: Story = {
  parameters: storybookDocsParameter(xAxisExample),
  name: 'X Axis (band scale)',
  render: (args) => ({
    components: { LumeAxis },
    setup() {
      const bottomMargin = 32;

      const computedContainerSize = computed(() => ({
        width: args.width,
        height: args.height - bottomMargin,
      }));

      const computedScale = computed(() => args.scale.range([0, args.width]));

      return { args, computedContainerSize, computedScale };
    },
    template: `<svg :width="args.width" :height="args.height">
    <g>
      <lume-axis v-bind="args" :scale="computedScale" :container-size="computedContainerSize" />
    </g>
  </svg>`,
  }),
  args: {
    scale: SCALES.band,
    type: 'x',
    options: { ...xOptions, gridLines: true },
  },
};

export const yAxis: Story = {
  parameters: storybookDocsParameter(yAxisExample),
  name: 'Y Axis (linear scale)',
  render: (args) => ({
    components: { LumeAxis },
    setup() {
      const leftMargin = 36;
      const verticalMargin = 14;

      const computedContainerSize = computed(() => ({
        width: args.width - leftMargin,
        height: args.height - verticalMargin * 2,
      }));

      const computedScale = computed(() =>
        args.scale.range([args.height - verticalMargin * 2, 0])
      );

      const transform = `translate(${leftMargin}, ${verticalMargin})`;

      return { args, computedContainerSize, computedScale, transform };
    },
    template: `<svg :width="args.width" :height="args.height">
    <g :transform="transform">
      <lume-axis v-bind="args" :scale="computedScale" :container-size="computedContainerSize" />
    </g>
  </svg>`,
  }),
  args: {
    scale: SCALES.linear,
    type: 'y',
    options: yOptions,
  },
};

export const yAxisTickAlignStart: Story = {
  parameters: storybookDocsParameter(yAxisTickAlignStartExample),
  name: 'Y Axis (left-aligned tick labels)',
  render: (args) => ({
    components: { LumeAxis },
    setup() {
      const leftMargin = 52;
      const verticalMargin = 14;

      const computedContainerSize = computed(() => ({
        width: args.width - leftMargin,
        height: args.height - verticalMargin * 2,
      }));

      const computedScale = computed(() =>
        args.scale.range([args.height - verticalMargin * 2, 0])
      );

      const transform = `translate(${leftMargin}, ${verticalMargin})`;

      return { args, computedContainerSize, computedScale, transform };
    },
    template: `<svg :width="args.width" :height="args.height">
    <g :transform="transform">
      <lume-axis v-bind="args" :scale="computedScale" :container-size="computedContainerSize" />
    </g>
  </svg>`,
  }),
  args: {
    ...yAxis.args,
    scale: scaleLinear().domain([0, 10000]),
    options: { ...yOptions, tickAlign: 'start' },
  },
};

export const bothAxes: Story = {
  parameters: storybookDocsParameter(bothAxesExample),
  name: 'Both Axes (band + linear)',
  render: (args) => ({
    components: { LumeAxis },
    setup() {
      const leftMargin = 36;
      const topMargin = 14;
      const bottomMargin = 32;

      const computedContainerSize = computed(() => ({
        width: args.width - leftMargin,
        height: args.height - topMargin - bottomMargin,
      }));

      const computedXScale = computed(() =>
        SCALES.band.range([0, args.width - leftMargin])
      );

      const computedYScale = computed(() =>
        SCALES.linear.range([args.height - topMargin - bottomMargin, 0])
      );

      const transform = `translate(${leftMargin}, ${topMargin})`;

      return {
        args,
        computedContainerSize,
        computedXScale,
        computedYScale,
        transform,
      };
    },
    template: `<svg :width="args.width" :height="args.height">
    <g :transform="transform">
      <lume-axis v-bind="args" type="x" :scale="computedXScale" :container-size="computedContainerSize" />
      <lume-axis v-bind="args" type="y" :scale="computedYScale" :container-size="computedContainerSize" />
    </g>
  </svg>`,
  }),
  args: {
    ...withSizeArgs(540, 200),
    options: { ...xOptions, gridLines: true },
  },
};
