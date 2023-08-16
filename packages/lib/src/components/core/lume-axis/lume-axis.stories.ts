import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
import { computed } from 'vue';
import { scaleBand, scaleLinear } from 'd3';

import LumeAxis from './lume-axis.vue';
import { xOptions, yOptions } from './defaults';

const SCALES = {
  band: scaleBand().domain(['0', '1', '2', '3', '4', '5', '6']),
  linear: scaleLinear().domain([0, 100]),
};

export default {
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

const Template = ({ args }) => ({
  components: { LumeAxis },
  setup() {
    const computedContainerSize = computed(() => ({
      width: args.width,
      height: args.height,
    }));

    const computedScale = computed(() =>
      args.scale.range(
        args.type === 'x' ? [0, args.width] : [args.height - 28, 0]
      )
    );

    const transform = computed(
      () =>
        `translate(${args.type === 'x' ? 0 : 28}, ${
          args.type === 'x' ? -28 : 14
        })`
    );

    return { args, computedContainerSize, computedScale, transform };
  },
  template: `
    <svg :width="args.width" :height="args.height">
      <g :transform="transform">
        <lume-axis v-bind="args" :scale="computedScale" :container-size="computedContainerSize" />
      </g>
    </svg>
  `,
});

export const xAxis = Template.bind({});
xAxis.args = {
  scale: SCALES.band,
  type: 'x',
  options: { ...xOptions, gridLines: true },
};
xAxis.storyName = 'X Axis (band scale)';

export const yAxis = Template.bind({});
yAxis.args = {
  scale: SCALES.linear,
  type: 'y',
  options: yOptions,
};
yAxis.storyName = 'Y Axis (linear scale)';

export const bothAxes = ({ args }) => ({
  components: { LumeAxis },
  setup() {
    const computedContainerSize = computed(() => ({
      width: args.width - 28,
      height: args.height - 32,
    }));

    const computedXScale = computed(() =>
      SCALES.band.range([0, args.width - 28])
    );

    const computedYScale = computed(() =>
      SCALES.linear.range([args.height - 32, 0])
    );

    const transform = computed(() => `translate(28, 14)`);

    return {
      args,
      computedContainerSize,
      computedXScale,
      computedYScale,
      transform,
    };
  },
  template: `
    <svg :width="args.width" :height="args.height">
      <g :transform="transform">
        <lume-axis v-bind="args" type="x" :scale="computedXScale" :container-size="computedContainerSize" />
        <lume-axis v-bind="args" type="y" :scale="computedYScale" :container-size="computedContainerSize" />
      </g>
    </svg>
  `,
});
bothAxes.argTypes = {
  ...withSizeArgTypes(),
  options: {
    control: 'object',
    description: 'Axis options.',
  },
};
bothAxes.args = {
  options: { ...xOptions, gridLines: true },
  ...withSizeArgs(540, 200),
};
