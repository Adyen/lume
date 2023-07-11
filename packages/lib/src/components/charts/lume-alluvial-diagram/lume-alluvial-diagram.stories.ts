import { ref } from 'vue';
import {
  actionEventHandlerTemplate,
  captureAction,
  withSizeArgs,
  withSizeArgTypes,
} from '@/docs/storybook-helpers';
import DATASETS from '@/docs/storybook-data/alluvial-data';

import LumeAlluvialDiagram from './lume-alluvial-diagram.vue';
import LumeAlluvialNodeLabel from '../../groups/lume-alluvial-group/components/lume-alluvial-node-label';
import LumeAlluvialNodeValue from '../../groups/lume-alluvial-group/components/lume-alluvial-node-value';
import LumeTooltip from '../../core/lume-tooltip';
import { options as defaultOptions } from './defaults';

export default {
  title: 'Charts/Alluvial diagram',
  component: LumeAlluvialDiagram,
  argTypes: {
    ...withSizeArgTypes(),
    data: {
      control: 'object',
      description: 'Chart data.',
    },
    options: {
      control: 'object',
      description: 'Chart/axes options.',
    },
    title: {
      control: 'text',
      description: 'Chart title.',
    },
    hoveredElement: {
      control: 'text',
      description: 'Hovered node or link (ID)',
    },
  },
  args: {
    ...withSizeArgs(),
    options: Object.fromEntries(
      Object.entries(defaultOptions).filter(
        ([key]) => !key.includes('nodeAlign') && !key.includes('valueFormat')
      )
    ),
    title: 'Alluvial diagram',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/r9fPqTXA4dlP6SIyfmGlDC/%F0%9F%8C%9D-Lume---Data-Visualization-Library?node-id=15%3A8105',
    },
  },
};

const Template = ({ args }) => {
  return {
    components: { LumeAlluvialDiagram },
    setup() {
      return { args };
    },
    methods: { captureAction },
    template: `
      <div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-alluvial-diagram v-bind="args" ${actionEventHandlerTemplate} />
      </div>
  `,
  };
};

export const Basic = Template.bind({});
Basic.args = {
  ...DATASETS.Basic,
};

export const RealData = Template.bind({});
RealData.args = {
  ...withSizeArgs(920, 460),
  ...DATASETS.RealData,
};

export const MultipleLevels = Template.bind({});
MultipleLevels.args = {
  ...withSizeArgs(),
  ...DATASETS.MultipleLevels,
};

export const MultipleLevelsWithColorDerivationFromIncomingLinks = Template.bind(
  {}
);
MultipleLevelsWithColorDerivationFromIncomingLinks.args = {
  ...withSizeArgs(),
  ...DATASETS.MultipleLevelsWithColorDerivationFromIncomingLinks,
};

export const Empty = Template.bind({});
Empty.args = {
  ...withSizeArgs(),
  ...DATASETS.Empty,
};

export const CustomCurveFunction = Template.bind({});
CustomCurveFunction.args = {
  ...withSizeArgs(540, 220),
  ...DATASETS.CustomCurveFunction,
};

const CustomNodeSlotsTemplate = ({ args }) => {
  return {
    components: {
      LumeTooltip,
      LumeAlluvialDiagram,
      LumeAlluvialNodeLabel,
      LumeAlluvialNodeValue,
    },
    setup() {
      const targetElement = ref(null);
      return { args, targetElement };
    },
    methods: { captureAction },
    template: `
      <div :style="{ width: args.width + 'px', height: args.height + 'px' }">
        <lume-alluvial-diagram v-bind="args">
          <template #node-text-B="{ node }">
            <tspan
              style="cursor: pointer;"
              @mouseenter.native="targetElement = $event.target"
              @mouseleave.native="targetElement = null"
            >ℹ️</tspan>
            <lume-alluvial-node-label dx="4">Custom label</lume-alluvial-node-label>
            <lume-alluvial-node-value>
              <tspan style="font-style: italic; fill: green">+{{ (node.transitionValue || node.value) * 0.12 * 1e5 / 1e5 }}%</tspan>
              {{ node.transitionValue || node.value }}
            </lume-alluvial-node-value>
          </template>
          <template #tooltip="props">
            <lume-tooltip v-bind="props" v-if="!!targetElement" :opened="!!targetElement" :target-element="targetElement">
              Some additional info about the node.
            </lume-tooltip>
          </template>
        </lume-alluvial-diagram>
      </div>
      `,
  };
};

export const CustomNodeSlots = CustomNodeSlotsTemplate.bind({});
CustomNodeSlots.args = {
  ...withSizeArgs(),
  ...DATASETS.Basic,
};
