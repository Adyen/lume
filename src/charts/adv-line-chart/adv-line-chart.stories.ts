import { computed } from '@vue/composition-api';
import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';

import AdvLineChart from './adv-line-chart.vue';
import { options as defaultOptions } from './defaults';

const DATASETS = {
  Single: {
    data: [
      {
        values: [10, 30, 20, 50, 40, 70, 60],
        color: '01',
        label: 'Hamburgers',
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
  Multiple: {
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
      {
        values: [50, null, 60, 40, 20, { value: 30 }, 10],
        color: '03',
        label: 'Kebabs',
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
      'Apr 7',
      'Apr 8',
      'Apr 9',
      'Apr 10',
      'Apr 11',
      'Apr 12',
      'Apr 13',
      'Apr 14',
      'Apr 15',
      'Apr 16',
      'Apr 17',
      'Apr 18',
      'Apr 19',
      'Apr 20',
      'Apr 21',
      'Apr 22',
      'Apr 23',
      'Apr 24',
      'Apr 25',
      'Apr 26',
      'Apr 27',
      'Apr 28',
      'Apr 29',
      'Apr 30',
      'May 1',
      'May 2',
      'May 3',
      'May 4',
    ],
  },
};

export default {
  title: 'Charts/Line chart',
  component: AdvLineChart,
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
    title: {
      control: 'text',
      description: 'Chart title',
    },
  },
  args: {
    ...withSizeArgs(),
    dataset: Object.keys(DATASETS)[0],
    options: defaultOptions,
    title: 'Line chart',
  },
};

export const Basic = ({ args, argTypes }) => {
  return {
    components: { AdvLineChart },
    props: Object.keys(argTypes),
    setup(props) {
      const data = computed(() => DATASETS[props.dataset].data);
      const labels = computed(() => DATASETS[props.dataset].labels);

      return { args, data, labels, props };
    },
    template: `
    <div :style="{ width: width + 'px', height: height + 'px' }">
        <adv-line-chart
          v-bind="props" :data="data" :labels="labels"
        />
    </div>
  `,
  };
};
