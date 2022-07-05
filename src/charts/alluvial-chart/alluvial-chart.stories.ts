import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';
import AlluvialChart from './alluvial-chart.vue';

const alluvial = {
    values: [
        {
            label: 'A',
            color: '01',
            id: 'A',
            targets: [
                { node: 'D', value: 15 },
                { node: 'E', value: 42 },
            ],
        },
        {
            label: 'B',
            color: '02',
            id: 'B',
            targets: [
                { node: 'D', value: 45 },
                { node: 'E', value: 42 },
            ],
        },
        {
            label: 'C',
            color: '03',
            id: 'C',
            targets: [
                { node: 'D', value: 20 },
            ],
        },
        {
            label: 'D',
            id: 'D',
            color: '07',
        },
        {
            label: 'E',
            id: 'E',
            color: '06',
        },
    ],
    nodePadding: 20,
    nodeWidth: 15
};

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
    <div
        style="padding: 0 16px"
        :style="{ width: width + 'px', height: height + 'px' }"
    >
      <alluvial-chart :data="alluvial" />
    </div>
  `,
    };
};
