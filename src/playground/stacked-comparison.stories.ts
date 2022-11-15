import { toRefs } from 'vue';

import LumeStackedBarChart from '../components/charts/lume-stacked-bar-chart';
import LumeStackedBarChart2 from '../components/charts/lume-stacked-bar-chart/lume-stacked-bar-chart2.vue';
import LumeTooltip from '@/components/core/lume-tooltip';

import DATASETS from '@/docs/storybook-data/base-data';
import { useBase } from '@/composables/base';

export default {
  title: 'Playground/Stacked Comparison',
  component: LumeStackedBarChart,
  argTypes: {},
  args: {},
};

export const Basic = ({ argTypes }) => {
  return {
    components: { LumeStackedBarChart, LumeStackedBarChart2, LumeTooltip },
    props: Object.keys(argTypes),
    setup(props) {
      const { data } = toRefs(props);
      function tooltipItems(index) {
        const { internalData } = useBase(data);
        return [...internalData.value]
          .reverse()
          ?.map(({ color, label, values }) => {
            return {
              type: 'line',
              color,
              label,
              value: values[index]?.label ?? values[index]?.value ?? 'No data',
            };
          });
      }

      return { props, tooltipItems };
    },
    template: `
    <div style="width: 1200px; height: 320px; display: flex; gap: 32px">
      <!-- regular -->
      <div style="width: 100%">
        <lume-stacked-bar-chart v-bind="props" title="Regular" />
        <p><br/><br/>First dataset to be plotted is Toyota (from 0 upwards)<br/>Tooltip is not reversed and doesn't match the visual order of the stacked bars</p>
      </div>

      <!-- reverse tooltip -->
      <div style="width: 100%">
        <lume-stacked-bar-chart v-bind="props" title="Reverse tooltip">
          <template #tooltip="ttProps">
            <lume-tooltip v-if="ttProps.opened" v-bind="ttProps" position="top" :title="labels[ttProps.hoveredIndex]" :items="tooltipItems(ttProps.hoveredIndex)" />
          </template>
        </lume-stacked-bar-chart>
        <p><br/><br/>First dataset to be plotted is Toyota (from 0 upwards)<br/>Tooltip item order is reversed to match the visual order of the stacked bars</p>
      </div>

      <!-- reverse data -->
      <div style="width: 100%">
        <lume-stacked-bar-chart2 v-bind="props" title="Reverse data plotting" />
        <p><br/><br/>First dataset to be plotted is now Nissan (from 0 upwards)<br/>Tooltip is not reversed but matches the visual order of the stacked bars</p>
      </div>
    </div>
    `,
  };
};
Basic.args = {
  data: DATASETS.Multiple.data,
  labels: DATASETS.Multiple.labels,
};
