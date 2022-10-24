import CustomClasses from './custom-classes.vue';

import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
import { options as defaultOptions } from '@/components/charts/lume-single-bar-chart/defaults';

export default {
  title: 'Playground/Custom classes',
  component: CustomClasses,
  argTypes: {
    ...withSizeArgTypes(),
    options: {
      control: 'object',
    },
  },
  args: {
    ...withSizeArgs(),
    options: defaultOptions,
    data: [
      {
        values: [20, 50, 30, 35, 70, 90, 40],
        label: 'People who used dotted lines',
        color: '#def4f4',
      },
    ],
    labels: [...Array(7)].map((_, i) => `June ${i + 1}`),
    title: 'Custom bar classes',
  },
};

export const Basic = ({ argTypes }) => {
  return {
    components: { CustomClasses },
    props: Object.keys(argTypes),
    setup(props) {
      return { props };
    },
    template: `
    <div :style="{ width: width + 'px', height: height + 'px' }">
      <custom-classes v-bind="props" />
    </div>
    `,
  };
};
