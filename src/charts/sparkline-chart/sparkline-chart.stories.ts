import { computed } from '@vue/composition-api';
import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';

import SparklineChart from './sparkline-chart.vue';

import { options as defaultOptions } from './defaults';

const DATASETS = {
  Simple: {
    data: [
      {
        values: [12, 14, 8, 10, 20, 9, 8, 4, 12, -4, -8, 0, 15, 8, 9, 10],
        color: '01',
        legend: 'Hamburgers',
      },
    ],
  },
  'Null values': {
    data: [
      {
        values: [10, null, 40, 50, null, 30, 60],
        color: '02',
        legend: 'Hot dogs',
      },
    ],
    labels: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
  },
};

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
  component: SparklineChart,
  argTypes: {
    ...withSizeArgTypes(),
    dataset: {
      control: 'select',
      options: Object.keys(DATASETS),
      description: 'Sets the data/labels properties.',
    },
    options: {
      control: 'object',
      description: 'Chart/axes options.',
    },
    color: {
      control: 'select',
      options: COLORS,
      description: 'Line color',
    },
    areaColor: {
      control: 'select',
      options: COLORS,
      description: 'Line color',
    },
  },
  args: {
    ...withSizeArgs(300, 80),
    dataset: Object.keys(DATASETS)[0],
    options: defaultOptions,
  },
};

export const Basic = ({ args, argTypes }) => {
  return {
    components: { SparklineChart },
    props: Object.keys(argTypes),
    setup(props) {
      const data = computed(() => {
        // eslint-disable-next-line no-undef
        const dataset = structuredClone(DATASETS[props.dataset].data); // Deep copy dataset array
        if (props.color) dataset[0].color = props.color;
        if (props.areaColor) dataset[0].areaColor = props.areaColor;
        return dataset;
      });
      const labels = computed(() => DATASETS[props.dataset].labels);

      return { args, data, labels };
    },
    template: `
    <div :style="{ width: width + 'px', height: height + 'px' }">
                <sparkline-chart
                    :data="data" :labels="labels" :options="options"
                />
            </div>
  `,
  };
};
