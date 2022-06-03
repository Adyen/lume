import { storiesOf } from '@storybook/vue';
import {
  AxisOptionsMixin,
  SizeKnobsMixin,
  convertAxisPropsIntoOptions,
} from '@/utils/storybook-helpers';
import HorizontalGroupedBarChart from './horizontal-grouped-bar-chart.vue';

storiesOf('Charts / Horizontal grouped bar chart', module) // eslint-disable-line
  .add('Basic', () => ({
    components: { HorizontalGroupedBarChart },
    props: {
      ...AxisOptionsMixin('x', true),
      ...AxisOptionsMixin('y', true),
      ...SizeKnobsMixin(),
    },
    template: `
            <div :style="{ width: width + 'px', height: height + 'px' }">
                <horizontal-grouped-bar-chart
                    :data="data" :labels="labels" :options="options"
                />
            </div>
        `,
    data: () => ({
      data: [
        { values: [10, 20, 30] },
        { values: [20, 30, 40] },
        { values: [-10, 0, 30] },
        { values: [-20, -30, 40] },
        { values: [60, null, -50] },
        { values: [40, -10, 30] },
        { values: [-50, 30, 20] },
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
