import { storiesOf } from '@storybook/vue';
import { boolean } from '@storybook/addon-knobs';
import { SizeKnobsMixin } from '@/utils/storybook-helpers';
import LineChart from './line-chart.vue';
import notes from './README.md';

storiesOf('Charts / Line chart', module)
    .add('Basic', () => ({
        components: { LineChart },
        props: {
            startOnZero: {
                type: Boolean,
                default: boolean('Start on zero', true)
            },
            ...SizeKnobsMixin(),
        },
        template: `
            <div :style="{ width: width + 'px', height: height + 'px' }">
                <line-chart
                    :data="lineChartData" :labels="barChartLabels" :start-on-zero="startOnZero"
                />
            </div>
        `,
        data: () => ({
            lineChartData: [
                { values: [10, 30, -20, 50, 40, 70, 60], color: '01', legend: 'Hamburgers' },
                { values: [30, 10, 20, 70, 50, null, 40], color: '02', legend: 'Hot dogs' },
            ],
            barChartLabels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        })
    }), { notes });
