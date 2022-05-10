import { storiesOf } from '@storybook/vue';
import { select } from '@storybook/addon-knobs';
import { SizeKnobsMixin } from '@/utils/storybook-helpers';
import SparklineChart from './sparkline-chart.vue';

const DATASETS = {
  Simple: {
    data: [
      { values: [12, 14, 8, 10, 20, 9, 8, 4, 12, -4, -8, 0, 15, 8, 9, 10], color: '01', legend: 'Hamburgers' },
    ],
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
  'Null values': {
    data: [
      { values: [10, null, 40, 50, null, 30, 60], color: '02', legend: 'Hot dogs' },
    ],
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
}

storiesOf('Charts / Sparkline chart', module) // eslint-disable-line
  .add('Basic', () => ({
    components: { SparklineChart },
    props: {
      dataset: {
        type: String,
        default: select('Dataset', Object.keys(DATASETS), Object.keys(DATASETS)[0]),
      },
      ...SizeKnobsMixin(300, 80),
    },
    computed: {
      data() {
        return DATASETS[this.dataset].data;
      },
      labels() {
        return DATASETS[this.dataset].labels;
      },
    },
    template: `
            <div :style="{ width: width + 'px', height: height + 'px' }">
                <sparkline-chart
                    :data="data" :labels="labels"
                />
            </div>
        `,
  }), {});
