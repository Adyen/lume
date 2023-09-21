import { computed, ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

import {
  actionEventHandlerTemplate,
  captureAction,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/base-data';

import LumeLineChart from './lume-line-chart.vue';
import LumeTooltip from '../../core/lume-tooltip/index';
import LumeTooltipSummary from '../../core/lume-tooltip/components/lume-tooltip-summary/index';
import { Colors } from '@/utils/constants';

const meta: Meta<typeof LumeLineChart> = {
  title: 'Charts/Line chart',
  component: LumeLineChart,
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
    options: {
      control: 'object',
      description: 'Chart/axes options.',
    },
    title: {
      control: 'text',
      description: 'Chart title',
    },
    hoveredIndex: {
      control: 'number',
      description: 'Chart hovered index',
    },
  },
  args: {
    ...withSizeArgs(),
    title: 'Line chart',
  },
};

export default meta;

type Story = StoryObj<typeof LumeLineChart>;

export const Basic: Story = {
  render: ({ args }) => ({
    components: { LumeLineChart },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-line-chart v-bind="args" ${actionEventHandlerTemplate} />
</div>`,
  }),
  args: {
    ...DATASETS.CatsMetIn2023,
    title: 'Cats met in 2023',
  },
};

export const MultipleDatasets: Story = {
  render: ({ args }) => ({
    components: { LumeLineChart },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-line-chart v-bind="args" ${actionEventHandlerTemplate} />
</div>`,
  }),
  args: {
    ...DATASETS.AnimalsMetIn2023,
    title: 'Pets met in 2023',
  },
};

export const MultipleDatasetsWithCustomTooltip: Story = {
  render: ({ args }) => ({
    components: { LumeLineChart, LumeTooltip, LumeTooltipSummary },
    setup() {
      const showSummary = ref(false);
      const customItemsFunction = (data, hoveredIndex) => {
        if (hoveredIndex > -1) {
          return data.map((item) => ({
            ...item,
            value: item.values[hoveredIndex].value,
          }));
        }
        return [];
      };
      const computeTotal = (data, hoveredIndex) => {
        if (hoveredIndex > -1) {
          return data.reduce(
            (acc, current) => acc + current.values[hoveredIndex].value,
            0
          );
        }
        return 0;
      };
      return {
        args,
        captureAction,
        showSummary,
        customItemsFunction,
        computeTotal,
      };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-line-chart v-bind="args" ${actionEventHandlerTemplate}>
      <template #tooltip = "{ data, hoveredIndex, targetElement, handleMouseEnter, handleMouseLeave }">
        <lume-tooltip
          :items="customItemsFunction(data, hoveredIndex)"
          :target-element="targetElement"
          :options="args.options.tooltipOptions"
          position="top"
          @tooltip-mouseenter="handleMouseEnter"
          @tooltip-mouseleave="handleMouseLeave"
        >
          <template #title>
            <button @click="showSummary = !showSummary">
              <template v-if="showSummary">Hide</template>
              <template v-else>Show</template> additional information
            </button>
          </template>
          <template #summary>
            <lume-tooltip-summary v-show="showSummary">Total number of pets: {{ computeTotal(data, hoveredIndex) }}</lume-tooltip-summary>
          </template>
        </lume-tooltip>
       </template>
    </lume-line-chart>
</div>`,
  }),
  args: {
    ...DATASETS.AnimalsMetIn2023,
    title: 'Pets met in 2023',
    options: {
      tooltipOptions: {
        enablePointerEvents: true,
        withAnimation: false,
      },
    },
  },
};

export const CustomTooltip: Story = {
  render: ({ args }) => ({
    components: { LumeLineChart, LumeTooltip },
    setup() {
      const computedColor = computed(() => Colors[args.color]);
      const customItemsFunction = (data, hoveredIndex) => {
        if (hoveredIndex > -1) {
          const { color, label, values } = data[0];
          return [
            {
              color,
              label,
              value: `${values[hoveredIndex].value ?? 0} dogs`,
            },
          ];
        }
        return [];
      };
      return { args, customItemsFunction, computedColor };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-line-chart v-bind="args">
      <template #tooltip = "{ data, hoveredIndex, targetElement }">
        <lume-tooltip :items="customItemsFunction(data, hoveredIndex)" :target-element="targetElement" position="top"/>
      </template>
    </lume-line-chart>
  </div>`,
  }),
  args: {
    ...DATASETS.Single,
    options: {
      yAxisOptions: {
        skip: 2,
      },
      xAxisOptions: {
        skip: 2,
      },
    },
  },
};

export const Empty: Story = {
  render: ({ args }) => ({
    components: { LumeLineChart },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-line-chart v-bind="args" ${actionEventHandlerTemplate} />
</div>`,
  }),
  args: {
    ...DATASETS.Empty,
  },
};
