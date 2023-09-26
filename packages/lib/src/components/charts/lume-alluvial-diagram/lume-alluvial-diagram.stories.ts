import { ref } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3';

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

const meta: Meta<typeof LumeAlluvialDiagram> = {
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
};

export default meta;

type Story = StoryObj<typeof LumeAlluvialDiagram>;

export const Basic: Story = {
  render: ({ args }) => ({
    components: { LumeAlluvialDiagram },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-alluvial-diagram v-bind="args" ${actionEventHandlerTemplate} />
  </div>`,
  }),
  args: {
    ...DATASETS.Basic,
    title: 'Students performance in science exam',
  },
};

export const MultipleLevels: Story = {
  render: ({ args }) => ({
    components: { LumeAlluvialDiagram },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-alluvial-diagram v-bind="args" ${actionEventHandlerTemplate} />
  </div>`,
  }),
  args: {
    ...withSizeArgs(720),
    ...DATASETS.MultipleLevels,
    options: {
      valueFormat: (part, _) => `USD ${part}`,
      gradient: true,
    },
    title: 'Yearly average pet expenses in USA',
  },
};

export const MultipleLevelsWithColorDerivationFromIncomingLinks: Story = {
  render: ({ args }) => ({
    components: { LumeAlluvialDiagram },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-alluvial-diagram v-bind="args" ${actionEventHandlerTemplate} />
  </div>`,
  }),
  args: {
    ...DATASETS.MultipleLevelsWithColorDerivationFromIncomingLinks,
    options: { gradient: true },
    title: 'Color derivation from incoming links',
  },
};

export const CustomCurveFunction: Story = {
  render: ({ args }) => ({
    components: { LumeAlluvialDiagram },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-alluvial-diagram v-bind="args" ${actionEventHandlerTemplate} />
  </div>`,
  }),
  args: {
    ...withSizeArgs(540, 220),
    ...DATASETS.CustomCurveFunction,
    options: {
      valueFormat: (part, _) => `USD ${part}`,
    },
    title: 'November expenses on my cats',
  },
};

export const CustomNodeSlots: Story = {
  render: ({ args }) => ({
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
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-alluvial-diagram v-bind="args">
      <template #node-text-students="{ node }">
        <tspan
          style="cursor: pointer;"
          @mouseenter.native="targetElement = $event.target"
          @mouseleave.native="targetElement = null"
        >ℹ️</tspan>
        <lume-alluvial-node-label dx="4">Custom label</lume-alluvial-node-label>
        <lume-alluvial-node-value>
          <tspan style="font-style: italic; fill: green">+{{ Math.round((node.transitionValue || node.value) * 0.12 * 100) / 100 }}%</tspan>
          {{ node.transitionValue || node.value }}
        </lume-alluvial-node-value>
      </template>
      <template #tooltip="props">
        <lume-tooltip v-bind="props" v-if="!!targetElement" :opened="!!targetElement" :target-element="targetElement">
          Some additional info about the node.
        </lume-tooltip>
      </template>
    </lume-alluvial-diagram>
  </div>`,
  }),
  args: {
    ...DATASETS.Basic,
    title: 'Students performance in science exam',
  },
};

export const NodeOffset: Story = {
  render: ({ args }) => ({
    components: { LumeAlluvialDiagram },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-alluvial-diagram v-bind="args" ${actionEventHandlerTemplate} />
  </div>`,
  }),
  args: {
    ...withSizeArgs(720),
    ...DATASETS.Offset,
    options: {
      valueFormat: (part, _) => `USD ${part}`,
      gradient: true,
    },
    title: 'Yearly average pet expenses in USA',
  },
};

export const Empty: Story = {
  render: ({ args }) => ({
    components: { LumeAlluvialDiagram },
    setup() {
      return { args, captureAction };
    },
    template: `<div :style="{ width: args.width + 'px', height: args.height + 'px' }">
    <lume-alluvial-diagram v-bind="args" ${actionEventHandlerTemplate} />
  </div>`,
  }),
  args: {
    ...DATASETS.Empty,
  },
};
