import { computed } from '@vue/composition-api';
import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import DATASETS from '@/docs/storybook-data/sparkline-data';

import AdvSparkline from './adv-sparkline.vue';

import { options as defaultOptions } from './defaults';

const COLORS = {
  Default: null,
  '01': '01',
  '02': '02',
  '03': '03',
  '04': '04',
  '05': '05',
  '06': '06',
  '07': '07',
};

export default {
  title: 'Charts/Sparkline chart',
  component: AdvSparkline,
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
      options: Object.values(COLORS),
      description: 'Line color',
    },
    areaColor: {
      control: 'select',
      options: Object.values(COLORS),
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
    components: { AdvSparkline },
    props: Object.keys(argTypes),
    setup(props) {
      const computedData = computed(() => {
        // eslint-disable-next-line no-undef
        const dataset = structuredClone(props.data); // Deep copy dataset array
        if (props.color) dataset[0].color = props.color;
        if (props.areaColor) dataset[0].areaColor = props.areaColor;
        return dataset;
      });

      return { args, computedData };
    },
    template: `
        <div :style="{ width: width + 'px', height: height + 'px' }">
            <adv-sparkline :data="computedData" :options="options" />
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
