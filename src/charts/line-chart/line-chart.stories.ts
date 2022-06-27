import { computed } from '@vue/composition-api';
import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';

import LineChart from './line-chart.vue';
import { options as defaultOptions } from './defaults';

const DATASETS = {
  Simple: {
    data: [
      {
        values: [10, 30, -20, 50, 40, 70, 60],
        color: '01',
        label: 'Hamburgers',
      },
      {
        values: [30, 10, 20, 70, 50, null, 40],
        color: '02',
        label: 'Hot dogs',
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
  'Chargebacks_Fraud overview 28 days': {
    data: [
      {
        values: [
          0.0036, 0.004, 0.0036, 0.0036, 0.0036, 0.0036, 0.0038, 0.0036, 0.0036,
          0.0037, 0.0041, 0.0041, 0.0038, 0.0041, 0.004, 0.0036, 0.0036, 0.0041,
          0.0041, 0.004, 0.0038, 0.0041, 0.0037, 0.0038, 0.0037, 0.0041, 0.0038,
          0.0036,
        ],
        label: 'Chargebacks',
        color: '07',
        sticky: true,
      },
      {
        values: [
          0.0007, 0.0008, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007,
          0.0007, 0.0007, 0.0009, 0.0008, 0.0007, 0.0008, 0.0008, 0.0007,
          0.0007, 0.0009, 0.0008, 0.0008, 0.0007, 0.0009, 0.0007, 0.0007,
          0.0007, 0.0008, 0.0007, 0.0007,
        ],
        label: 'NOFs',
        color: '06',
        sticky: true,
      },
    ],
    labels: [
      'Apr 07',
      '08',
      '09',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      'May 01',
      '02',
      '03',
      '04',
    ],
  },
};

export default {
  title: 'Charts/Line chart',
  component: LineChart,
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
    startOnZero: {
      control: 'boolean',
      description:
        'Defines if the Y axis should start on `0`. If negative values are present, this property is ignored.',
    },
  },
  args: {
    ...withSizeArgs(),
    dataset: Object.keys(DATASETS)[0],
    options: defaultOptions,
    startOnZero: true,
  },
};

export const Basic = ({ args, argTypes }) => {
  return {
    components: { LineChart },
    props: Object.keys(argTypes),
    setup(props) {
      const data = computed(() => DATASETS[props.dataset].data);
      const labels = computed(() => DATASETS[props.dataset].labels);

      return { args, data, labels };
    },
    template: `
    <div :style="{ width: width + 'px', height: height + 'px' }">
        <line-chart
           :data="data" :labels="labels" :options="options"
        >
        </line-chart>
    </div>
  `,
  };
};
