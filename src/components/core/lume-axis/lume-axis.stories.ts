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
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A8525',
    },
  },
};

const Template = ({ argTypes }) => ({
  components: { LumeAxis },
  props: Object.keys(argTypes),
  setup(props: InstanceType<typeof LumeAxis>['$props']) {
    const computedContainerSize = computed(() => ({
      width: props.width,
      height: props.height,
    }));

    const computedScale = computed(() =>
      props.scale.range(
        props.type === 'x' ? [0, props.width] : [props.height - 28, 0]
      )
    );

    const transform = computed(
      () =>
        `translate(${props.type === 'x' ? 0 : 28}, ${
          props.type === 'x' ? -28 : 14
        })`
    );

    return { props, computedContainerSize, computedScale, transform };
  },
  template: `
    <svg :width="width" :height="height">
      <g :transform="transform">
        <lume-axis v-bind="props" :scale="computedScale" :container-size="computedContainerSize" />
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

export const bothAxes = ({ argTypes }) => ({
  components: { LumeAxis },
  props: Object.keys(argTypes),
  setup(props: InstanceType<typeof LumeAxis>['$props']) {
    const computedContainerSize = computed(() => ({
      width: props.width - 28,
      height: props.height - 32,
    }));

    const computedXScale = computed(() =>
      SCALES.band.range([0, props.width - 28])
    );

    const computedYScale = computed(() =>
      SCALES.linear.range([props.height - 32, 0])
    );

    const transform = computed(() => `translate(28, 14)`);

    return {
      props,
      computedContainerSize,
      computedXScale,
      computedYScale,
      transform,
    };
  },
  template: `
    <svg :width="width" :height="height">
      <g :transform="transform">
        <lume-axis v-bind="props" type="x" :scale="computedXScale" :container-size="computedContainerSize" />
        <lume-axis v-bind="props" type="y" :scale="computedYScale" :container-size="computedContainerSize" />
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
