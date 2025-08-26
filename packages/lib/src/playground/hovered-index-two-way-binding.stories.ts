import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import LumeLineChart from '../components/charts/lume-line-chart';

import DATASETS from '@/docs/storybook-data/base-data';

const meta: Meta<typeof LumeLineChart> = {
  title: 'Playground/hovered-index two-way binding',
  component: LumeLineChart,
};

export default meta;

type Story = StoryObj<typeof LumeLineChart>;

export const Basic: Story = {
  render: () => ({
    components: { LumeLineChart },
    setup() {
      const index = ref(-1);
      return { DATASETS, index };
    },
    template: `
    <div>
      <div style="width: 480px; height: 320px; margin-bottom: 16px">
          <lume-line-chart v-if="__VUE_VERSION__ === 2" v-bind="DATASETS.AdoptedAnimals" v-bind:hoveredIndex.sync="index" />
          <lume-line-chart v-else v-bind="DATASETS.AdoptedAnimals" v-model:hovered-index="index" />
      </div>
      <div>
          <label for="slider">Hovered index: {{ index }}</label>
          <input
              style="width: 100%"
              id="slider"
              type="range"
              min="-1"
              :max="DATASETS.AdoptedAnimals.labels.length - 1"
              v-model.number="index"
          />
      </div>
    </div>
    `,
  }),
};
