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
    const el = wrapper.find('[data-j-alluvial-diagram]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group]').exists()).toBeTruthy();
    expect(
      el.find('[data-j-alluvial-group__ghost-path]').exists()
    ).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__path]').exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__node-block]').exists()).toBeFalsy();
  });

  test('mounts component and sets prop values using random data', async () => {
    const data = generateData();
    const testSuite = AlluvialDiagramTestSuiteFactory(data);

    const wrapper = testSuite.run().wrapper;
    const el = wrapper.find('[data-j-alluvial-diagram]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group]').exists()).toBeTruthy();
    expect(
      el.find('[data-j-alluvial-group__ghost-path]').exists()
    ).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__path]').exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__node-block]').exists()).toBeFalsy();
  });

  test('should throw error in case of a dataset with circular links', async () => {
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

    const data = [
      {
        ...baseData,
        values,
      },
    ];

    const t = () =>
      mount(LumeAlluvialDiagram, {
        propsData: {
          data,
        },
      });

    expect(t).toThrow('circular link');
  });

  test('should be able to handle an empty dataset', async () => {
    const values = [];

    const data = [
      {
        ...baseData,
        values,
      },
    ];

    const t = () =>
      mount(LumeAlluvialDiagram, {
        propsData: {
          data,
        },
      });

    expect(t).toThrow('Invalid array length');
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

  test('should be able to handle an dataset with links to non-existing nodes', async () => {
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

    const t = () =>
      mount(LumeAlluvialDiagram, {
        propsData: {
          data,
        },
      });

    expect(t).toThrow('missing: C');
  });

  // Test interaction with elements
});
