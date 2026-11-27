import { computed } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import { Colors } from '@/types/utils';
import { storybookDocsParameter } from '@/docs/storybook-helpers';

import LumePoint from './lume-point.vue';
import basicExample from './__tests__/lume-point-basic-example.vue?raw';

const meta: Meta<typeof LumePoint> = {
  title: 'Core/Point',
  component: LumePoint,
  argTypes: {
    x: { control: { type: 'number', step: 10 } },
    y: { control: { type: 'number', step: 10 } },
    color: {
      control: 'select',
      options: Object.keys(Colors),
      description: 'Point color.',
    },
    radius: { control: 'number' },
  },
};

export default meta;

type Story = StoryObj<typeof LumePoint>;

export const Basic: Story = {
  parameters: storybookDocsParameter(basicExample),
  render: (args) => ({
    components: { LumePoint },
    setup() {
      const computedColor = computed(() => Colors[args.color]);
      return { args, computedColor };
    },
    template: `<svg width="300" height="300">
    <lume-point v-bind="args" :color="computedColor" active />
  </svg>`,
  }),

  args: {
    x: 150,
    y: 150,
    color: 'Darkteal',
    radius: 4,
  },
};
