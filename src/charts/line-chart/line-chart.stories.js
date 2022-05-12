import { storiesOf } from '@storybook/vue';
import { boolean, select } from '@storybook/addon-knobs';
import { AxisOptionsMixin, SizeKnobsMixin, convertAxisPropsIntoOptions } from '@/utils/storybook-helpers';
import LineChart from './line-chart.vue';
import notes from './README.md';

const DATASETS = {
  Simple: {
    data: [
      { values: [10, 30, -20, 50, 40, 70, 60], color: '01', legend: 'Hamburgers' },
      { values: [30, 10, 20, 70, 50, null, 40], color: '02', legend: 'Hot dogs' },
    ],
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  'Chargebacks & Fraud overview - 28 days': {
    data: [{ "values": [0.0036, 0.004, 0.0036, 0.0036, 0.0036, 0.0036, 0.0038, 0.0036, 0.0036, 0.0037, 0.0041, 0.0041, 0.0038, 0.0041, 0.004, 0.0036, 0.0036, 0.0041, 0.0041, 0.004, 0.0038, 0.0041, 0.0037, 0.0038, 0.0037, 0.0041, 0.0038, 0.0036], "legend": "Chargebacks", "color": "07", "sticky": true }, { "values": [0.0007, 0.0008, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007, 0.0007, 0.0009, 0.0008, 0.0007, 0.0008, 0.0008, 0.0007, 0.0007, 0.0009, 0.0008, 0.0008, 0.0007, 0.0009, 0.0007, 0.0007, 0.0007, 0.0008, 0.0007, 0.0007], "legend": "NOFs", "color": "06", "sticky": true }],
    labels: ["Apr 07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "May 01", "02", "03", "04"]
  }
}

storiesOf('Charts / Line chart', module) // eslint-disable-line
  .add('Basic', () => ({
    components: { LineChart },
    props: {
      dataset: {
        type: String,
        default: select('Dataset', Object.keys(DATASETS), Object.keys(DATASETS)[0]),
      },
      startOnZero: {
        type: Boolean,
        default: boolean('Start on zero', true)
      },
      ...AxisOptionsMixin('x'),
      ...AxisOptionsMixin('y'),
      ...SizeKnobsMixin(),
    },
    computed: {
      data() {
        return DATASETS[this.dataset].data;
      },
      labels() {
        return DATASETS[this.dataset].labels;
      },
      options() {
        return {
          xAxisOptions: convertAxisPropsIntoOptions(this.$props, 'x'),
          yAxisOptions: convertAxisPropsIntoOptions(this.$props, 'y'),
        }
      }
    },
    template: `
            <div :style="{ width: width + 'px', height: height + 'px' }">
                <line-chart
                    :data="data" :labels="labels" :options="options" :start-on-zero="startOnZero"
                >
                </line-chart>
            </div>
        `,
  }), { notes });
