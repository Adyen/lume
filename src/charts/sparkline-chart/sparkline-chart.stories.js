import { storiesOf } from '@storybook/vue';
import { select } from '@storybook/addon-knobs';
import { SizeKnobsMixin } from '@/utils/storybook-helpers';
import SparklineChart from './sparkline-chart.vue';

const DATASETS = {
  Simple: {
    data: [
      { values: [12, 14, 8, 10, 20, 9, 8, 4, 12, -4, -8, 0, 15, 8, 9, 10], color: '01', legend: 'Hamburgers' },
    ]
  },
  'Null values': {
    data: [
      { values: [10, null, 40, 50, null, 30, 60], color: '02', legend: 'Hot dogs' },
    ],
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
}

const COLORS = {
  Default: null,
  '01': '01',
  '02': '02',
  '03': '03',
  '04': '04',
  '05': '05',
  '06': '06',
  '07': '07',
}

storiesOf('Charts / Sparkline chart', module) // eslint-disable-line
  .add('Basic', () => ({
    components: { SparklineChart },
    props: {
      dataset: {
        type: String,
        default: select('Dataset', Object.keys(DATASETS), Object.keys(DATASETS)[0]),
      },
      color: {
        type: String,
        default: select('Color', COLORS),
      },
      areaColor: {
        type: String,
        default: select('Area color', COLORS),
      },
      ...SizeKnobsMixin(300, 80),
    },
    computed: {
      data() {
        // eslint-disable-next-line no-undef
        const dataset = structuredClone(DATASETS[this.dataset].data); // Deep copy dataset array
        if (this.color) dataset[0].color = this.color;
        if (this.areaColor) dataset[0].areaColor = this.areaColor;
        return dataset;
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
