import BarSparkline from './bar-sparkline.vue';

export default {
  title: 'Playground/Bar sparkline',
  component: BarSparkline,
  argTypes: {
    options: {
      control: 'object',
    },
  },
  args: {
    options: {
      margins: { top: 0, right: 0, bottom: 0, left: 0 },
      showAxes: false,
      withHover: false,
      withLegend: false,
    },
    data: [
      {
        values: [
          20,
          50,
          30,
          35,
          { value: 70, color: '01' },
          { value: 80, color: '01' },
          { value: 75, color: '01' },
        ],
        color: '02',
        label: 'Emojis',
        type: 'line',
      },
    ],
    labels: ['Cops', 'Frits!', 'Beer', '8 ball', 'Bear', 'Dogger', 'Barber'],
  },
};

export const Basic = ({ args, argTypes }) => {
  return {
    components: { BarSparkline },
    props: Object.keys(argTypes),
    setup() {
      return { args };
    },
    template: `
    <div style="width: 160px; height: 40px">
      <bar-sparkline v-bind="args" />
    </div>
    `,
  };
};
