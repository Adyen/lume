import { computed } from '@vue/composition-api';
import { withSizeArgs, withSizeArgTypes } from '@/utils/storybook-helpers';

import BoxPlot from './box-plot.vue';

import { data } from './story-datasets';
import { options as defaultOptions } from './defaults';

const DATASETS = {
  Simple: data,
};

export default {
  title: 'Charts/Box plot',
  component: BoxPlot,
  argTypes: {
    ...withSizeArgTypes(),
    dataset: {
      control: 'select',
      options: Object.keys(DATASETS),
      description: 'Sets the data/labels properties.',
    },
    options: {
      control: 'object',
      description: 'Chart/axes options.',
    },
  },
  args: {
    ...withSizeArgs(),
    dataset: Object.keys(DATASETS)[0],
    options: defaultOptions,
    startOnZero: true,
  },
};

export const Basic = ({ args, argTypes }) => {
  return {
    components: { BoxPlot },
    props: Object.keys(argTypes),
    setup(props) {
      const data = computed(() => DATASETS[props.dataset]);

      return { args, data };
    },
    template: `
         <div :style="{ width: width + 'px', height: height + 'px' }">
                <box-plot
                    :data="data"
                    :options="options"
                />
            </div>
  `,
  };
};
