import { toRefs } from 'vue';

import DATASETS from '@/docs/storybook-data/base-data';

import LumeChartLegend from './lume-chart-legend.vue';

import { useBase } from '../../../composables/base';

export default {
  title: 'Core/Legend',
  component: LumeChartLegend,
  argTypes: {
    data: {
      control: 'object',
      description: 'Chart data.',
    },
  },
  args: {},
};

const Template = ({ argTypes }) => ({
  components: { LumeChartLegend },
  props: Object.keys(argTypes),
  setup(props: InstanceType<typeof LumeChartLegend>['$props']) {
    const { data, labels } = toRefs(props);
    const { internalData } = useBase(data, labels);
    return { props, internalData };
  },
  template: `
    <lume-chart-legend v-bind="props" :data="internalData" />
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  data: DATASETS.Single.data,
};

export const MultipleDatasets = Template.bind({});
MultipleDatasets.args = {
  data: DATASETS.Multiple.data,
};
