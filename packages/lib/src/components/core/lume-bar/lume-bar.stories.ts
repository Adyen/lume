import { computed } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';

import LumeBar from './lume-bar.vue';

import { Colors } from '@/utils/constants';

const meta: Meta<typeof LumeBar> = {
  title: 'Core/Bar',
  component: LumeBar,
  argTypes: {
    x: { control: 'number' },
    y: { control: 'number' },
    ...withSizeArgTypes(),
    color: {
      control: 'select',
      options: Object.keys(Colors),
      description: 'Bar color.',
    },
    isFaded: { control: 'boolean' },
    transition: { control: 'select', options: ['width', 'height', null] },
  },
};

export default meta;

type Story = StoryObj<typeof LumeBar>;

export const Basic: Story = {
  render: ({ args }) => ({
    components: { LumeBar },
    setup() {
      const computedFillClass = computed(
        () => `lume-fill--` + Colors[args.color]
      );

      return { args, computedFillClass };
    },
    template: `<svg width="300" height="300">
    <lume-bar v-bind="args" :class-list="computedFillClass" />
  </svg>`,
  }),
  args: {
    x: 100,
    y: 100,
    ...withSizeArgs(100, 200),
    color: 'Skyblue',
    isFaded: false,
    transition: 'height',
  },
};
