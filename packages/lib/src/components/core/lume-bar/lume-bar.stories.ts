import { computed } from 'vue';
import {
  COLOR_CLASS_MAP,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';

import LumeBar from './lume-bar.vue';

export default {
  title: 'Core/Bar',
  component: LumeBar,
  argTypes: {
    x: { control: 'number' },
    y: { control: 'number' },
    ...withSizeArgTypes(),
    color: {
      control: 'select',
      options: Object.keys(COLOR_CLASS_MAP),
      description: 'Bar color.',
    },
    isFaded: { control: 'boolean' },
    transition: { control: 'select', options: ['width', 'height', null] },
  },
  args: {
    x: 100,
    y: 100,
    ...withSizeArgs(100, 200),
    color: Object.keys(COLOR_CLASS_MAP)[0],
    isFaded: false,
    transition: 'height',
  },
};

const Template = ({ args }) => ({
  components: { LumeBar },
  setup() {
    const computedFillClass = computed(
      () => `lume-fill--` + COLOR_CLASS_MAP[args.color]
    );

    return { args, computedFillClass };
  },
  template: `
    <svg width="300" height="300">
      <lume-bar v-bind="args" :class-list="computedFillClass" />
    </svg>
  `,
});

export const Basic = Template.bind({});
