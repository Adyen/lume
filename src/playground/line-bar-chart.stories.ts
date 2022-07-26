import LineBarChart from './line-bar-chart.vue';

export default {
  title: 'Playground/Line+bar chart',
  component: LineBarChart,
  argTypes: {
    options: {
      control: 'object',
    },
  },
  args: {
    options: {
      margins: { top: 44, right: 0, bottom: 32, left: 32 },
      yAxisOptions: { gridLines: true },
    },
    lineData: [
      {
        values: [10, 30, -10, 50, 40, 70, 60],
        color: '02',
        label: 'Hamburgers',
        type: 'line',
      },
      {
        values: [30, 10, 20, 70, 50, null, 40],
        color: '03',
        label: 'Hot dogs',
        type: 'line',
      },
    ],
    barData: [
      // {
      //   values: [60, 10, 0, null, 40, 20, 30],
      //   color: '04',
      //   label: 'Kebabs',
      //   type: 'bar'
      // },
      {
        values: [10, 40, -20, 50, 60, 70, 40],
        color: '06',
        label: 'Pizza',
        type: 'bar',
      },
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
  },
};

export const Basic = ({ args, argTypes }) => {
  return {
    components: { LineBarChart },
    props: Object.keys(argTypes),
    setup() {
      return { args };
    },
    template: `<line-bar-chart v-bind="args" />`,
  };
};
