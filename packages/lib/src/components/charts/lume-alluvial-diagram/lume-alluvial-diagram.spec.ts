import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';

import LumeAlluvialDiagram from './lume-alluvial-diagram.vue';

import { BaseTestSuite } from '@test/unit/reusable.test';
import { generateData } from '@test/unit/utils/data-generator';

import DATASETS from '@/docs/storybook-data/alluvial-data';

const AlluvialDiagramTestSuiteFactory = (data: any = DATASETS.Basic.data) =>
  new BaseTestSuite(LumeAlluvialDiagram, { data });
const [baseData] = generateData();

describe('lume-alluvial-diagram.vue', () => {
  let originalError = null;
  const stageWithData = (values) => {
    const data = [
      {
        ...baseData,
        values,
      },
    ];

    const testSuite = AlluvialDiagramTestSuiteFactory(data);

    const wrapper = testSuite.run().wrapper;
    const el = wrapper.find('[data-j-alluvial-diagram]');
    expect(el.exists()).toBeTruthy();
  };

  beforeAll(() => {
    // Suppress error output to the console
    originalError = console.error;
    console.error = vi.fn();
  });

  afterAll(() => {
    // Restore default error output setting
    console.error = originalError;
  });

  test('mounts component and sets prop values', async () => {
    const testSuite = AlluvialDiagramTestSuiteFactory();

    const wrapper = testSuite.run().wrapper;
    const el = wrapper.findComponent('[data-j-alluvial-diagram]');
    const props = el.props();

    expect(props.data).toBeDefined();
    expect(props.color).toBe('skyblue');
    expect(props.options).toBeDefined();

    expect(el.exists()).toBeTruthy();
  });

  test('mounts component and sets prop values using random data', async () => {
    const data = generateData();
    const testSuite = AlluvialDiagramTestSuiteFactory(data);

    const wrapper = testSuite.run().wrapper;
    const el = wrapper.find('[data-j-alluvial-diagram]');

    expect(el.exists()).toBeTruthy();
  });

  test('mounts with gradient definitions', async () => {
    const wrapper = mount(LumeAlluvialDiagram, {
      props: {
        data: DATASETS.Basic.data,
        options: { gradient: true },
      },
    });

    expect(wrapper.find('defs').exists()).toBe(true);
  });

  test('mounts with color derivation from incoming links', async () => {
    const wrapper = mount(LumeAlluvialDiagram, {
      props: {
        data: DATASETS.MultipleLevelsWithColorDerivationFromIncomingLinks.data,
        options: {
          nodePadding: 100,
        },
      },
    });

    await wrapper.setProps({
      options: {
        nodePadding: 200,
      },
    });

    expect(wrapper.findAll('[data-j-alluvial-sub-nodes]')).toHaveLength(2);
  });

  // should be tested in the scope of alluvial-graph
  test.skip('should throw error in case of a dataset with circular links', async () => {
    const values = [
      {
        label: 'A',
        color: '01',
        value: 'A',
        targets: [{ node: 'B', value: 50 }],
      },
      {
        label: 'B',
        color: '02',
        value: 'B',
        targets: [{ node: 'A', value: 50 }],
      },
    ];

    const data = [{ values }];

    mount(LumeAlluvialDiagram, { props: { data } });

    await nextTick();

    expect(console.error).toHaveBeenCalled();
  });

  // should be tested in the scope of alluvial-graph
  test.skip('should be able to handle an empty dataset', async () => {
    const values = [];

    const data = [
      {
        ...baseData,
        values,
      },
    ];

    mount(LumeAlluvialDiagram, { props: { data } });

    await nextTick();

    expect(console.error).toHaveBeenCalled();
  });

  test('should be able to handle an dataset with a single node', async () => {
    const values = [{ label: 'A', color: '01', value: 'A', targets: [] }];
    stageWithData(values);
  });

  test('should be able to handle an dataset with only nodes but no edges', async () => {
    const values = [
      { label: 'A', color: '01', value: 'A', targets: [] },
      { label: 'B', color: '02', value: 'B', targets: [] },
    ];
    stageWithData(values);
  });

  // should be tested in the scope of alluvial-graph
  test.skip('should be able to handle an dataset with links to non-existing nodes', async () => {
    const values = [
      { label: 'A', color: '01', value: 'A', targets: [] },
      {
        label: 'B',
        color: '02',
        value: 'B',
        targets: [{ node: 'C', value: 50 }],
      },
    ];
    const data = [
      {
        ...baseData,
        values,
      },
    ];

    mount(LumeAlluvialDiagram, { props: { data } });

    await nextTick();

    expect(console.error).toHaveBeenCalled();
  });

  test('should calculate node offset based on provided value', async () => {
    const data = [
      {
        values: [
          {
            label: 'Students',
            color: 'skyblue',
            value: 'students',
            targets: [
              { node: 'passed', value: 60 },
              { node: 'retriedExam', value: 50 },
            ],
            offset: 40,
          },
          {
            label: 'Retried exam',
            color: 'skyblue',
            value: 'retriedExam',
            targets: [
              { node: 'failed', value: 10, color: 'red' },
              { node: 'passed', value: 40 },
            ],
          },
          {
            label: 'Passed',
            color: 'skyblue',
            value: 'passed',
          },
          {
            label: 'Failed',
            color: 'red',
            value: 'failed',
          },
        ],
      },
    ];

    const diagram = mount(LumeAlluvialDiagram, { props: { data } });

    await diagram.setProps({ containerSize: { width: 720, height: 480 } }); // Trigger graph calculation

    expect(
      diagram.find('.lume-alluvial-group__node-block').attributes().y
    ).toBe('39');
  });
});
