import { storiesOf } from '@storybook/vue';
import { SizeKnobsMixin } from '@/utils/storybook-helpers';
import BarChart from './bar-chart.vue';

storiesOf('Charts / Bar chart', module)
    .add('Basic', () => ({
        components: { BarChart },
        props: {
            ...SizeKnobsMixin(),
        },
        template: `
            <div :style="{ width: width + 'px', height: height + 'px' }">
                <bar-chart
                    :data="data" :labels="labels"
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
                { value: -26 }
            ],
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        })
    }));
