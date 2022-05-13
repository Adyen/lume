import { storiesOf } from '@storybook/vue';
import {
  AxisOptionsMixin,
  SizeKnobsMixin,
  convertAxisPropsIntoOptions,
} from '@/utils/storybook-helpers';
import BarChart from './bar-chart.vue';

storiesOf('Charts / Bar chart', module) // eslint-disable-line
  .add('Basic', () => ({
    components: { BarChart },
    props: {
      ...AxisOptionsMixin('x'),
      ...AxisOptionsMixin('y'),
      ...SizeKnobsMixin(),
    },
    template: `
            <div :style="{ width: width + 'px', height: height + 'px' }">
                <bar-chart
                    :data="data" :labels="labels" :options="options"
                />
            </div>
        `,
    data: () => ({
      data: [
        { value: 10 },
        { value: 40 },
        { value: null },
        { value: 30, color: '02' },
        { value: 60 },
        { value: 0 },
        { value: -26 },
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
    }),
    computed: {
      options() {
        return {
          xAxisOptions: convertAxisPropsIntoOptions(this.$props, 'x'),
          yAxisOptions: convertAxisPropsIntoOptions(this.$props, 'y'),
        };
      },
    },
  }));
