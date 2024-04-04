import { computed } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import { Colors } from '@/types/utils';

import LumeLine from './lume-line.vue';

const meta: Meta<typeof LumeLine> = {
  title: 'Core/Line',
  component: LumeLine,
  argTypes: {
    width: { control: 'number' },
    color: {
      control: 'select',
      options: Object.keys(Colors),
      description: 'Line color.',
    },
    x1: { control: { type: 'number', step: 10 } },
    x2: { control: { type: 'number', step: 10 } },
    y1: { control: { type: 'number', step: 10 } },
    y2: { control: { type: 'number', step: 10 } },
    dashed: { control: 'boolean' },
    animationDelay: { control: { type: 'number', step: 0.1 } },
    animationDuration: { control: 'number' },
  },
};

export default meta;

type Story = StoryObj<typeof LumeLine>;

export const Basic: Story = {
  render: ({ args }) => ({
    components: { LumeLine },
    setup() {
      const computedColor = computed(() => Colors[args.color]);
      const pathDefinition = computed(
        () => `M${args.x1},${args.y1} L${args.x2},${args.y2}`
      );

      return { args, computedColor, pathDefinition };
    },
    template: `<svg width="300" height="300">
    <lume-line v-bind="args" :color="computedColor" :path-definition="pathDefinition" />
  </svg>`,
  }),
  args: {
    width: 2,
    color: 'Royalblue',
    x1: 50,
    x2: 250,
    y1: 250,
    y2: 50,
    dashed: false,
  },
};
