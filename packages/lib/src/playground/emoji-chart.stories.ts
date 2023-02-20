import LumeChart from '@/components/core/lume-chart';
import EmojiGroup from './emoji-group.vue';

export default {
  title: 'Playground/Emoji chart',
  component: EmojiGroup,
  argTypes: {
    options: {
      control: 'object',
    },
  },
  args: {
    options: {
      margins: { top: 16, right: 0, bottom: 32, left: 32 },
      yAxisOptions: { gridLines: true, title: 'Favorite emojis' },
      tooltipOptions: {
        offset: 24,
      },
    },
    data: [
      {
        values: [20, 50, 30, 35, 40, 70, 25],
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
    components: { LumeChart, EmojiGroup },
    props: Object.keys(argTypes),
    setup() {
      return { args };
    },
    template: `
    <div style="width: 600px; height: 300px">
      <lume-chart v-bind="args">
        <template #groups="props">
          <emoji-group v-bind="props" />
        </template>
      </lume-chart>
    </div>
    `,
  };
};
