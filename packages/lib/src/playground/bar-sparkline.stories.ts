import BarSparkline from './bar-sparkline.vue';

export default {
  title: 'Playground/Bar sparkline',
  component: BarSparkline,
  argTypes: {
    options: {
      control: 'object',
    },
    barWidth: { control: { type: 'number' } },
    gap: { control: { type: 'number' } },
    height: { control: { type: 'number' } },
  },
  args: {
    data: [
      {
        values: [
          20,
          50,
          30,
          60,
          { value: 80, color: '09' },
          { value: 75, color: '09' },
        ],
        label: 'Abandoned pets',
        type: 'line',
        color: 'green',
      },
    ],
    labels: [0, 1, 2, 3, 4, 5],
    barWidth: 12,
    gap: 2,
    height: 20,
  },
};

export const Basic = ({ args }) => {
  return {
    components: { BarSparkline },
    setup() {
      return { args };
    },
    template: `
      <div :style="{ height: args.height + 'px' }">
        <bar-sparkline v-bind="args" />
      </div>
    `,
  };
};
