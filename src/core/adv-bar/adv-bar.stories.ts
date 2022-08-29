import { computed } from '@vue/composition-api';
import {
  COLOR_CLASS_MAP,
  withSizeArgs,
  withSizeArgTypes,
} from '@/utils/storybook-helpers';

import AdvBar from './adv-bar.vue';

export default {
  title: 'Core/Bar',
  component: AdvBar,
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

const Template = ({ argTypes }) => ({
  components: { AdvBar },
  props: Object.keys(argTypes),
  setup(props: InstanceType<typeof AdvBar>['$props']) {
    const computedFillClass = computed(
      () => `adv-fill-color--` + COLOR_CLASS_MAP[props.color]
    );

    return { props, computedFillClass };
  },
  template: `
    <svg width="300" height="300">
      <adv-bar v-bind="props" :fill-class="computedFillClass" />
    </svg>
  `,
});

export const Basic = Template.bind({});
