import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import AlluvialChart from './adv-alluvial-chart.vue';

const alluvial = [{
    values: [
        {
            label: 'A',
            color: '01',
            value: 'A',
            id: 'A',
            targets: [
                { node: 'D', value: 15 },
                { node: 'E', value: 42 },
            ],
        },
        {
            label: 'B',
            color: '02',
            value: 'B',
            id: 'B',
            targets: [
                { node: 'D', value: 45 },
                { node: 'E', value: 42 },
            ],
        },
        {
            label: 'C',
            color: '03',
            value: 'C',
            id: 'C',
            targets: [
                { node: 'D', value: 20 },
            ],
        },
        {
            label: 'D',
            value: 'D',
            id: 'D',
            color: '07',
        },
        {
            label: 'E',
            value: 'E',
            id: 'E',
            color: '06',
        },
    ],
    nodePadding: 20,
    nodeWidth: 15
}];

export default {
    title: 'Charts/Alluvial chart',
    component: AlluvialChart,
    argTypes: {
        ...withSizeArgTypes(),
    },
    args: {
        ...withSizeArgs(),
    },
};

export const Basic = ({ argTypes }) => {
    return {
        components: { AlluvialChart },
        props: Object.keys(argTypes),
        data: () => ({
            alluvial
        }),
        template: `
    <div :style="{ width: width + 'px', height: height + 'px' }">
      <alluvial-chart :data="alluvial" />
    </div>
  `,
    };
};
