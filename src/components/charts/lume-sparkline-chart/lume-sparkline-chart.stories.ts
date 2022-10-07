import { computed } from 'vue';
import {
  COLOR_CLASS_MAP,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/sparkline-data';

import LumeSparkline from './lume-sparkline-chart.vue';

import { options as defaultOptions } from './defaults';

export default {
  title: 'Charts/Sparkline chart',
  component: LumeSparkline,
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
  },
  args: {
    ...withSizeArgs(300, 80),
    options: defaultOptions,
  },
};

const Template = ({ args, argTypes }) => {
  return {
    components: { LumeSparkline },
    props: Object.keys(argTypes),
    setup(props) {
      const computedData = computed(() => {
        // eslint-disable-next-line no-undef
        const dataset = structuredClone(props.data); // Deep copy dataset array
        if (props.color) dataset[0].color = COLOR_CLASS_MAP[props.color];
        if (props.areaColor)
          dataset[0].areaColor = COLOR_CLASS_MAP[props.areaColor];
        return dataset;
      });

      return { args, computedData };
    },
    template: `
        <div :style="{ width: width + 'px', height: height + 'px' }">
            <lume-sparkline :data="computedData" :options="options" />
        </div>
    `,
  };
};

export const Basic = Template.bind({});
Basic.args = {
  ...DATASETS.Basic,
};

export const NegativeValues = Template.bind({});
NegativeValues.args = {
  ...DATASETS.NegativeValue,
};

export const NullValues = Template.bind({});
NullValues.args = {
  ...DATASETS.NullValues,
};