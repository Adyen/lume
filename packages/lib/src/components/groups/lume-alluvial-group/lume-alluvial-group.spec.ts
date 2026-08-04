import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { nextTick, reactive } from 'vue';
import { mount } from '@vue/test-utils';

import LumeAlluvialGroup from './lume-alluvial-group.vue';

import { options as defaultOptions } from '@/components/charts/lume-alluvial-diagram/defaults';
import { alluvialData } from '@test/unit/alluvial-mock-data';

const CONTAINER_SIZE = { width: 1000, height: 480 };
const NODE_HEADERS = ['first', 'second', 'third', 'fourth'];

const PARENT_NODE_ID = 'flowB';
const SUB_NODE_IDS = ['subA', 'subB', 'subC'];
const SUB_NODE_TARGET_ID = 'resultB';
const NEXT_COLUMN_NODE_ID = 'stepA';

const FADED_NODE_CLASS = 'lume-alluvial-group__node--faded';
const FOCUSED_NODE_CLASS = 'lume-alluvial-group__node--focused';

document.body.innerHTML = `<svg id="root"></svg>`; // prevent no SVG parent console.warn

function withSubNodeOffsets(offsets: Array<number | false>) {
  return [
    {
      ...alluvialData[0],
      values: alluvialData[0].values.map((value) => {
        const subNodeIndex = SUB_NODE_IDS.indexOf(value.value);

        if (subNodeIndex === -1) return value;

        return { ...value, offset: offsets[subNodeIndex] };
      }),
    },
  ];
}

async function mountGroup(data = alluvialData, options = {}) {
  const containerSize = reactive({ width: 0, height: 0 });

  const wrapper = mount(LumeAlluvialGroup, {
    attachTo: document.getElementById('root'),
    global: { provide: { chartID: 'test-chart' } },
    props: {
      data,
      options: { ...defaultOptions, nodeHeaders: NODE_HEADERS, ...options },
      containerSize,
    },
  });

  Object.assign(containerSize, CONTAINER_SIZE); // Trigger the graph computation
  await nextTick();

  return wrapper;
}

function getNodeBlocks(wrapper) {
  return wrapper.findAll('rect.lume-alluvial-group__node-block');
}

function getNodeGeometry(wrapper) {
  const nodeTexts = wrapper.findAll('.lume-alluvial-group__node-text');

  return getNodeBlocks(wrapper).reduce((geometry, block, index) => {
    const { x, y, width, height } = block.attributes();

    geometry[nodeTexts[index].attributes()['data-id']] = {
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height),
    };

    return geometry;
  }, {});
}

function getLinkPath(wrapper, id: string) {
  return wrapper.find(`[data-j-alluvial-path][data-id="${id}"]`);
}

function getLinkWidth(wrapper, id: string) {
  return Number(getLinkPath(wrapper, id).attributes()['stroke-width']);
}

async function expandParentNode(wrapper) {
  await wrapper.find(`[data-id="${PARENT_NODE_ID}"]`).trigger('click');
}

function getNodeClasses(wrapper, id: string) {
  const nodeText = wrapper.find(
    `.lume-alluvial-group__node-text[data-id="${id}"]`
  );

  return nodeText.element.parentElement.parentElement.getAttribute('class');
}

describe('lume-alluvial-group.vue', () => {
  // jsdom doesn't implement SVG measurement, used for the diagram's label margins
  beforeAll(() => {
    Object.assign(Element.prototype, {
      getBBox: () => ({ x: 0, y: 0, width: 0, height: 0 }),
    });
  });

  afterAll(() => {
    Reflect.deleteProperty(Element.prototype, 'getBBox');
  });

  test('mounts component', async () => {
    const wrapper = await mountGroup();

    expect(wrapper.find('[data-j-alluvial-group]').exists()).toBe(true);
    expect(getNodeBlocks(wrapper).length).toBeGreaterThan(0);
  });

  describe('expandable nodes', () => {
    test('should render sub-nodes only while their parent node is expanded', async () => {
      const wrapper = await mountGroup();
      const nodeCount = alluvialData[0].values.length;

      expect(getNodeBlocks(wrapper)).toHaveLength(
        nodeCount - SUB_NODE_IDS.length
      );
      SUB_NODE_IDS.forEach((id) =>
        expect(getNodeGeometry(wrapper)[id]).toBeUndefined()
      );

      await expandParentNode(wrapper);

      expect(getNodeBlocks(wrapper)).toHaveLength(nodeCount);
      SUB_NODE_IDS.forEach((id) =>
        expect(getNodeGeometry(wrapper)[id]).toBeDefined()
      );

      await expandParentNode(wrapper);

      expect(getNodeBlocks(wrapper)).toHaveLength(
        nodeCount - SUB_NODE_IDS.length
      );
    });

    test('should toggle sub-nodes with the keyboard and mark the parent node as expandable', async () => {
      const wrapper = await mountGroup();
      const nodeCount = alluvialData[0].values.length;
      const parentNode = wrapper.find(`[data-id="${PARENT_NODE_ID}"]`);

      expect(
        wrapper.findAll('.lume-alluvial-group__node--expandable')
      ).toHaveLength(1);
      expect(wrapper.findAll('[data-j-alluvial-node-outline]')).toHaveLength(1);
      expect(parentNode.element.parentElement.getAttribute('tabindex')).toBe(
        '0'
      );

      await parentNode.trigger('keydown.enter');

      expect(getNodeBlocks(wrapper)).toHaveLength(nodeCount);

      await parentNode.trigger('keydown.space');

      expect(getNodeBlocks(wrapper)).toHaveLength(
        nodeCount - SUB_NODE_IDS.length
      );
    });

    test('should highlight an expandable node while it is focused', async () => {
      const wrapper = await mountGroup();
      const expandableNode = wrapper.find('[tabindex="0"]');
      const isParentNodeHighlighted = () =>
        getNodeClasses(wrapper, PARENT_NODE_ID).includes(FOCUSED_NODE_CLASS) &&
        getNodeClasses(wrapper, NEXT_COLUMN_NODE_ID).includes(FADED_NODE_CLASS);

      await expandableNode.trigger('focus');

      expect(isParentNodeHighlighted()).toBe(true);

      await expandableNode.trigger('blur');

      expect(isParentNodeHighlighted()).toBe(false);
    });

    test('should keep an expandable node highlighted while either the pointer or the focus is on it', async () => {
      const wrapper = await mountGroup();
      const expandableNode = wrapper.find('[tabindex="0"]');
      const isParentNodeHighlighted = () =>
        getNodeClasses(wrapper, PARENT_NODE_ID).includes(FOCUSED_NODE_CLASS);

      await expandableNode.trigger('focus');
      await expandableNode.trigger('mouseover');
      await expandableNode.trigger('mouseout');

      expect(isParentNodeHighlighted()).toBe(true);

      await expandableNode.trigger('mouseover');
      await expandableNode.trigger('blur');

      expect(isParentNodeHighlighted()).toBe(true);

      await expandableNode.trigger('mouseout');

      expect(isParentNodeHighlighted()).toBe(false);
    });

    test('should center sub-nodes in the gap between their parent and the following column', async () => {
      const wrapper = await mountGroup();

      await expandParentNode(wrapper);

      const geometry = getNodeGeometry(wrapper);
      const parent = geometry[PARENT_NODE_ID];
      const gapStart = parent.x + parent.width;
      const gapEnd = geometry[NEXT_COLUMN_NODE_ID].x;
      const expectedX = gapStart + (gapEnd - gapStart - parent.width) / 2;

      expect(expectedX).toBeGreaterThan(gapStart);
      SUB_NODE_IDS.forEach((id) => expect(geometry[id].x).toBe(expectedX));
    });

    test('should stack sub-nodes proportionally to their parent node', async () => {
      const wrapper = await mountGroup(
        withSubNodeOffsets([false, false, false])
      );

      await expandParentNode(wrapper);

      const geometry = getNodeGeometry(wrapper);
      const parent = geometry[PARENT_NODE_ID];
      const subNodes = SUB_NODE_IDS.map((id) => geometry[id]);
      const totalHeight = subNodes.reduce((acc, { height }) => acc + height, 0);

      expect(totalHeight).toBeCloseTo(parent.height);
      subNodes.slice(1).forEach((subNode, index) => {
        const previousSubNode = subNodes[index];
        expect(subNode.y - (previousSubNode.y + previousSubNode.height)).toBe(
          defaultOptions.nodePadding
        );
      });
    });

    test('should stack sub-nodes with their configured offsets', async () => {
      const offsets = [-40, 4, 24];
      const wrapper = await mountGroup(withSubNodeOffsets(offsets));

      await expandParentNode(wrapper);

      const geometry = getNodeGeometry(wrapper);
      const parent = geometry[PARENT_NODE_ID];
      const [first, second, third] = SUB_NODE_IDS.map((id) => geometry[id]);

      expect(first.y).toBe(parent.y + offsets[0]);
      expect(second.y).toBe(first.y + first.height + offsets[1]);
      expect(third.y).toBe(second.y + second.height + offsets[2]);
    });

    test('should not add a node column for the sub-nodes', async () => {
      const wrapper = await mountGroup();

      await expandParentNode(wrapper);

      expect(
        wrapper.findAll('text.lume-alluvial-group__node-header')
      ).toHaveLength(NODE_HEADERS.length);
    });

    test('should replace the aggregated parent link with the sub-node links', async () => {
      const wrapper = await mountGroup();
      const aggregatedLinkId = `${PARENT_NODE_ID}:${SUB_NODE_TARGET_ID}`;

      expect(getLinkPath(wrapper, aggregatedLinkId).exists()).toBe(true);

      const aggregatedLinkWidth = getLinkWidth(wrapper, aggregatedLinkId);

      await expandParentNode(wrapper);

      expect(getLinkPath(wrapper, aggregatedLinkId).exists()).toBe(false);

      const subNodeLinkWidth = SUB_NODE_IDS.reduce(
        (acc, id) => acc + getLinkWidth(wrapper, `${id}:${SUB_NODE_TARGET_ID}`),
        0
      );

      expect(subNodeLinkWidth).toBeCloseTo(aggregatedLinkWidth);
      SUB_NODE_IDS.forEach((id) =>
        expect(getLinkPath(wrapper, `${PARENT_NODE_ID}:${id}`).exists()).toBe(
          true
        )
      );
    });
  });
});
