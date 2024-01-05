import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import LumeBarChart from '../components/charts/lume-bar-chart';

const meta: Meta<typeof LumeBarChart> = {
  title: 'Playground/Synced tooltips',
  component: LumeBarChart,
  argTypes: {
    ...withSizeArgTypes(),
    data: {
      control: 'object',
      description: 'Chart data.',
    },
    labels: {
      control: 'object',
      description: 'Chart labels.',
    },
    hoveredIndex: {
      control: 'number',
      description: 'Chart hovered index',
    },
  },
  args: {
    ...withSizeArgs(),
    options: {
      margins: 'auto',
    },
  },
};

export default meta;

type Story = StoryObj<typeof LumeBarChart>;

export const Basic: Story = {
  render: ({ args }) => ({
    components: { LumeBarChart },
    setup() {
      const containerStyle = {
        width: '480px',
        height: '320px',
        padding: '8px',
        border: '1px solid var(--lume-color--grey-50)',
        borderRadius: '4px',
        overflow: 'hidden',
      };
      const hoveredIndex = ref(-1);
      return { args, containerStyle, hoveredIndex };
    },
    template: `
    <div :style="containerStyle" style="margin-bottom: 16px">
        <lume-bar-chart
            v-bind="args"
            type="stacked"
            :hovered-index="hoveredIndex"
            @tooltip-opened="hoveredIndex = $event.index"
            @tooltip-moved="hoveredIndex = $event.index"
            @tooltip-closed="hoveredIndex = -1"
        />
    </div>
    <div :style="containerStyle">
        <lume-bar-chart
            v-bind="args"
            type="stacked"
            :hovered-index="hoveredIndex"
            @tooltip-opened="hoveredIndex = $event.index"
            @tooltip-moved="hoveredIndex = $event.index"
            @tooltip-closed="hoveredIndex = -1"
        />
    </div>
    `,
  }),
  args: {
    ...DATASETS.AnimalsMetIn2023,
    title: 'Synced tooltips',
  },
};
