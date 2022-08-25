import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import AdvAlluvialChart from './adv-alluvial-chart.vue';

const alluvial = {
    data: [{
        values: [
            {
                label: 'A',
                color: '01',
                value: 'A',
                targets: [
                    {node: 'D', value: 1},
                    {node: 'E', value: 42},
                    {node: 'C', value: 3}
                ],
            },
            {
                label: 'B',
                color: '02',
                value: 'B',
                targets: [
                    {node: 'D', value: 8},
                    {node: 'E', value: 1},
                    {node: 'C', value: 1}
                ],
            },
            {
                label: 'C',
                color: '03',
                value: 'C',
                targets: [
                    {node: 'D', value: 12},
                    {node: 'E', value: 1}
                ],
            },
            {
                label: 'D',
                value: 'D',
                color: '07',
            },
            {
                label: 'E',
                value: 'E',
                color: '06',
            },
        ],
        nodePadding: 20,
        nodeWidth: 15
    }]
};

export default {
    title: 'Charts/Alluvial chart',
    component: AdvAlluvialChart,
    argTypes: {
        ...withSizeArgTypes(),
        data: {
            control: 'object',
            description: 'Chart data.',
        },
    },
    args: {
        ...withSizeArgs(),
        options: {},
    },
};

export const Basic = ({ argTypes }) => {
    return {
        components: { AdvAlluvialChart },
        props: Object.keys(argTypes),
        setup(props) {
            return { props };
        },
        template: `
    <div :style="{ width: width + 'px', height: height + 'px' }">
      <adv-alluvial-chart v-bind="props" />
    </div>
  `,
    };
};

Basic.args = alluvial;
