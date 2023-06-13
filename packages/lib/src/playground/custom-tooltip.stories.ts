import LumeChart from '@/components/core/lume-chart';
import LumeLineGroup from '@/components/groups/lume-line-group';
import LumeTooltip from '@/components/core/lume-tooltip';
import LumeTooltipTitle from '@/components/core/lume-tooltip/components/lume-tooltip-title';
import LumeTooltipSummary from '@/components/core/lume-tooltip/components/lume-tooltip-summary';
import LumeTooltipItem from '@/components/core/lume-tooltip/components/lume-tooltip-item';

import CustomTooltip from './custom-tooltip.vue';

import { withSizeArgs, withSizeArgTypes } from '@/docs/storybook-helpers';
import { options as defaultOptions } from '@/components/charts/lume-line-chart/defaults';

export default {
  title: 'Playground/Custom tooltip',
  component: CustomTooltip,
  argTypes: {
    ...withSizeArgTypes(),
  },
  args: {
    ...withSizeArgs(),
    options: defaultOptions,
    data: [
      {
        values: [20, 50, 30, 35, 10, 50, 30],
        color: 'violet',
        label: 'Purchases',
      },
    ],
    labels: [
      'Mar 2022',
      'Apr 2022',
      'May 2022',
      'Jun 2022',
      'Jul 2022',
      'Aug 2022',
      'Sep 2022',
    ],
  },
};

export const CustomTooltipElement = ({ args }) => ({
  components: { LumeChart, LumeLineGroup, CustomTooltip },
  setup() {
    return { args };
  },
  template: `
  <div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-chart v-bind="args">
      <template #groups="props">
        <lume-line-group v-bind="props" />
      </template>
      <template #tooltip="props">
        <custom-tooltip v-bind="props" />
      </template>
    </lume-chart>
  </div>
  `,
});

export const CustomTooltipContent = ({ args }) => ({
  components: { LumeChart, LumeLineGroup, CustomTooltip },
  setup() {
    return { args };
  },
  template: `
  <div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-chart v-bind="args">
      <template #groups="props">
        <lume-line-group v-bind="props" />
      </template>
      <template #tooltip-content="{ data, labels, hoveredIndex }">
        On {{ labels[hoveredIndex] }}, the value was <strong>{{ data[0].values[hoveredIndex].value }}</strong>
      </template>
    </lume-chart>
  </div>
  `,
});
CustomTooltipContent.args = {
  options: {
    ...defaultOptions,
    tooltipOptions: { position: 'right-end' },
  },
};

export const CustomTooltipContentWithSlots = ({ args }) => ({
  components: {
    LumeChart,
    LumeLineGroup,
    LumeTooltip,
    LumeTooltipTitle,
    LumeTooltipSummary,
    LumeTooltipItem,
  },
  setup() {
    const isPositive = (value: number) => value > 25;
    const getPercentage = (value: number) =>
      `${Math.round((25 / value + Number.EPSILON) * 100) / 100} %`;
    return { args, getPercentage, isPositive };
  },
  template: `
  <div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-chart v-bind="args">
      <template #groups="props">
        <lume-line-group v-bind="props" />
      </template>
      <template #tooltip="props">
        <lume-tooltip v-if="props.opened" v-bind="props">
          <template #title>
            <lume-tooltip-title>Purchases of items in 2022</lume-tooltip-title>
          </template>
          <template #summary>
            <lume-tooltip-summary>These amounts are subject to change.</lume-tooltip-summary>
          </template>
          <template #items>
            <lume-tooltip-item color="violet">
              <template #label>Purchase #</template>
              <template #value>{{ props.items[0].value }}</template>
            </lume-tooltip-item>
            <lume-tooltip-item>
              <template #label>Growth</template>
              <template #value>
                <span :style="{ color: isPositive(props.items[0].value) ? '#0abf53' : '#f33030' }">
                  {{ isPositive(props.items[0].value) ? '↑' : '↓' }} {{ getPercentage(props.items[0].value) }}
                </span>
              </template>
            </lume-tooltip-item>
          </template>
        </lume-tooltip>
      </template>
    </lume-chart>
  </div>
  `,
});
CustomTooltipContentWithSlots.args = {
  options: {
    ...defaultOptions,
  },
};
