import ScaleTime from './scale-time.vue';

export default {
  title: 'Playground/Scale time',
  component: ScaleTime,
  argTypes: {
    startDate: { control: 'date' },
    endDate: { control: 'date' },
    tickCount: { control: 'number' },
    skipNumber: { control: 'number' },
  },
  args: {
    startDate: new Date('2022-06-05'),
    endDate: new Date('2022-07-05'),
    tickCount: 40,
    skipNumber: 0,
  },
};

export const Basic = ({ args }) => {
  return {
    components: { ScaleTime },
    setup() {
      return { args };
    },
    template: `
      <scale-time v-bind="args" />
    `,
  };
};
