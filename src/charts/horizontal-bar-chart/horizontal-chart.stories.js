import { storiesOf } from '@storybook/vue';
import {
  AxisOptionsMixin,
  SizeKnobsMixin,
  convertAxisPropsIntoOptions,
} from '@/utils/storybook-helpers';
import HorizontalBarChart from './horizontal-bar-chart.vue';

storiesOf('Charts / Horizontal bar chart', module) // eslint-disable-line
  .add('Basic', () => ({
    components: { HorizontalBarChart },
    props: {
      ...AxisOptionsMixin('x', true),
      ...AxisOptionsMixin('y', true),
      ...SizeKnobsMixin(),
    },
    template: `
            <div :style="{ width: width + 'px', height: height + 'px' }">
                <horizontal-bar-chart
                    :data="data" :labels="labels" :options="options"
                />
            </div>
        `,
    data: () => ({
      data: [{
        values: [10, 40, null, 30, 60, 0, -26]
      }],
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
