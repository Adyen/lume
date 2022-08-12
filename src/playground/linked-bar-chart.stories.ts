import LinkedBarChart from './linked-bar-chart.vue';
import { options as defaultOptions } from '@/charts/adv-single-bar-chart/defaults';

export default {
  title: 'Playground/Linked bar chart',
  component: LinkedBarChart,
  argTypes: {
    options: {
      control: 'object',
    },
  },
  args: {
    options: {
      ...defaultOptions.vertical,
      yAxisOptions: { ...defaultOptions.vertical.yAxisOptions, tickCount: 5 },
    },
    data: [
      {
        values: [7, 5, 0, 3, 3, 5, null],
        color: '06',
        label: 'Chargebacks',
        type: 'bar',
      },
      {
        values: [6, 1, 0, 2, 1, 0, null],
        color: '07',
        label: 'NOFs',
        type: 'bar',
      },
    ],
    labels: ['Aug 4', 'Aug 5', 'Aug 6', 'Aug 7', 'Aug 8', 'Aug 9', 'Aug 10'],
    title: 'Linked bar chart',
  },
};

export const Basic = ({ args, argTypes }) => {
  return {
    components: { LinkedBarChart },
    props: Object.keys(argTypes),
    setup() {
      return { args };
    },
    template: `
    <div style="width: 500px; height: 400px">
      <linked-bar-chart v-bind="args" />
    </div>
    `,
  };
};
