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

  // Test interaction with elements
});
