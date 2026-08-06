import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';
import { nextTick, reactive } from 'vue';
import { mount } from '@vue/test-utils';

import LumeAlluvialGroup from './lume-alluvial-group.vue';

import { options as defaultOptions } from '@/components/charts/lume-alluvial-diagram/defaults';
import { alluvialData } from '@test/unit/alluvial-mock-data';
import { NODE_LABEL_PADDING } from './constants';

const CONTAINER_SIZE = { width: 1000, height: 480 };
const NODE_HEADERS = ['first', 'second', 'third', 'fourth'];

const FIRST_COLUMN_NODE_ID = 'sourceA';
const MIDDLE_COLUMN_NODE_ID = 'flowA';
const LAST_COLUMN_NODE_ID = 'resultA';

const LEFT_LABEL_CLASS = 'lume-alluvial-group__node-text--left';
const LEFT_HEADER_CLASS = 'lume-alluvial-group__node-header--left';
const RIGHT_HEADER_CLASS = 'lume-alluvial-group__node-header--right';

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

function getNodeBlock(wrapper, id: string) {
  const index = wrapper
    .findAll('.lume-alluvial-group__node-text')
    .findIndex((text) => text.attributes()['data-id'] === id);

  return getNodeBlocks(wrapper)[index];
}

function getColumnPositions(wrapper) {
  const positions = Object.values(getNodeGeometry(wrapper)).map(
    ({ x }: { x: number }) => x
  );

  return [...new Set(positions)].sort((a, b) => a - b);
}

function getNodeLabel(wrapper, id: string) {
  return wrapper.find(`.lume-alluvial-group__node-text[data-id="${id}"]`);
}

function getNodeClasses(wrapper, id: string) {
  return getNodeLabel(
    wrapper,
    id
  ).element.parentElement.parentElement.getAttribute('class');
}

function getNodeHeader(wrapper, index: number) {
  const header = wrapper.findAll('text.lume-alluvial-group__node-header')[
    index
  ];
  const [, x] = header.element.parentElement
    .getAttribute('transform')
    .match(/translate\((-?[\d.]+)/);

  return { x: Number(x), classes: header.classes() };
}

function getNodeLabelX(wrapper, id: string) {
  const [, x] = getNodeLabel(wrapper, id)
    .attributes('transform')
    .match(/translate\((-?[\d.]+)/);

  return Number(x);
}

function expectLabelBeforeNode(wrapper, id: string, geometry) {
  expect(getNodeLabelX(wrapper, id)).toBe(geometry[id].x - NODE_LABEL_PADDING);
  expect(getNodeLabel(wrapper, id).classes()).toContain(LEFT_LABEL_CLASS);
}

function expectLabelAfterNode(wrapper, id: string, geometry) {
  expect(getNodeLabelX(wrapper, id)).toBe(
    geometry[id].x + geometry[id].width + NODE_LABEL_PADDING
  );
  expect(getNodeLabel(wrapper, id).classes()).not.toContain(LEFT_LABEL_CLASS);
}

describe('lume-alluvial-group.vue', () => {
  let labelWidth = 0;

  // jsdom doesn't implement SVG measurement, used for the diagram's label margins
  beforeAll(() => {
    Object.assign(Element.prototype, {
      getBBox: () => ({ x: 0, y: 0, width: labelWidth, height: 0 }),
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

    test("should only toggle sub-nodes from the node block with a 'block' expansion trigger", async () => {
      const wrapper = await mountGroup(alluvialData, {
        nodeExpansionTrigger: 'block',
      });
      const nodeCount = alluvialData[0].values.length;
      const collapsedNodeCount = nodeCount - SUB_NODE_IDS.length;

      expect(getNodeClasses(wrapper, PARENT_NODE_ID)).toContain(
        'lume-alluvial-group__node--expandable-block'
      );

      await wrapper.find(`[data-id="${PARENT_NODE_ID}"]`).trigger('click'); // Node label

      expect(getNodeBlocks(wrapper)).toHaveLength(collapsedNodeCount);

      await getNodeBlock(wrapper, PARENT_NODE_ID).trigger('click');

      expect(getNodeBlocks(wrapper)).toHaveLength(nodeCount);

      await getNodeBlock(wrapper, PARENT_NODE_ID).trigger('click');

      expect(getNodeBlocks(wrapper)).toHaveLength(collapsedNodeCount);

      await wrapper
        .find(`[data-id="${PARENT_NODE_ID}"]`)
        .trigger('keydown.enter');

      expect(getNodeBlocks(wrapper)).toHaveLength(nodeCount);
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

  describe('node label alignment', () => {
    const LABEL_WIDTH = 40;

    beforeEach(() => {
      labelWidth = LABEL_WIDTH;
    });

    afterEach(() => {
      labelWidth = 0;
    });

    test('should render the first column labels before and the last column ones after their node by default', async () => {
      const wrapper = await mountGroup();
      const geometry = getNodeGeometry(wrapper);

      expectLabelBeforeNode(wrapper, FIRST_COLUMN_NODE_ID, geometry);
      expectLabelAfterNode(wrapper, LAST_COLUMN_NODE_ID, geometry);
    });

    test('should render the first column labels after their node when aligned right', async () => {
      const wrapper = await mountGroup(alluvialData, {
        alignFirstNodeLabels: 'right',
      });
      const geometry = getNodeGeometry(wrapper);

      expectLabelAfterNode(wrapper, FIRST_COLUMN_NODE_ID, geometry);
      expectLabelAfterNode(wrapper, LAST_COLUMN_NODE_ID, geometry);
    });

    test('should render the last column labels before their node when aligned left', async () => {
      const wrapper = await mountGroup(alluvialData, {
        alignLastNodeLabels: 'left',
      });
      const geometry = getNodeGeometry(wrapper);

      expectLabelBeforeNode(wrapper, FIRST_COLUMN_NODE_ID, geometry);
      expectLabelBeforeNode(wrapper, LAST_COLUMN_NODE_ID, geometry);
    });

    test('should keep the middle column labels after their node', async () => {
      const wrapper = await mountGroup(alluvialData, {
        alignFirstNodeLabels: 'right',
        alignLastNodeLabels: 'left',
      });

      expectLabelAfterNode(
        wrapper,
        MIDDLE_COLUMN_NODE_ID,
        getNodeGeometry(wrapper)
      );
    });

    test('should only reserve horizontal space for the labels rendered outside the columns', async () => {
      const defaultColumns = getColumnPositions(await mountGroup());
      const innerColumns = getColumnPositions(
        await mountGroup(alluvialData, {
          alignFirstNodeLabels: 'right',
          alignLastNodeLabels: 'left',
        })
      );
      const lastColumnEnd = (positions: Array<number>) =>
        positions[positions.length - 1] + defaultOptions.nodeWidth;

      expect(defaultColumns[0]).toBe(LABEL_WIDTH);
      expect(lastColumnEnd(defaultColumns)).toBe(
        CONTAINER_SIZE.width - LABEL_WIDTH
      );

      expect(innerColumns[0]).toBe(0);
      expect(lastColumnEnd(innerColumns)).toBe(CONTAINER_SIZE.width);
    });

    test('should center the node headers on their column by default', async () => {
      const wrapper = await mountGroup();
      const columns = getColumnPositions(wrapper);
      const center = (x: number) => x + defaultOptions.nodeWidth / 2;

      expect(getNodeHeader(wrapper, 0)).toEqual({
        x: center(columns[0]),
        classes: expect.not.arrayContaining([
          LEFT_HEADER_CLASS,
          RIGHT_HEADER_CLASS,
        ]),
      });
      expect(getNodeHeader(wrapper, NODE_HEADERS.length - 1).x).toBe(
        center(columns[columns.length - 1])
      );
    });

    test('should align the node headers to the outer edge of the columns rendering their labels inwards', async () => {
      const wrapper = await mountGroup(alluvialData, {
        alignFirstNodeLabels: 'right',
        alignLastNodeLabels: 'left',
      });
      const columns = getColumnPositions(wrapper);
      const firstHeader = getNodeHeader(wrapper, 0);
      const lastHeader = getNodeHeader(wrapper, NODE_HEADERS.length - 1);

      expect(firstHeader.x).toBe(columns[0]);
      expect(firstHeader.classes).toContain(LEFT_HEADER_CLASS);

      expect(lastHeader.x).toBe(
        columns[columns.length - 1] + defaultOptions.nodeWidth
      );
      expect(lastHeader.classes).toContain(RIGHT_HEADER_CLASS);
    });
  });
});
