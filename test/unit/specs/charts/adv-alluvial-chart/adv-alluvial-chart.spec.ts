import AdvAlluvialChart from '@/charts/adv-alluvial-chart/adv-alluvial-chart.vue';
import DATASETS from '@/docs/storybook-data/alluvial-data';
import { BaseTestSuite } from '../../../reusable.test';
import { generateData } from './data-generator';
import { mount } from '@vue/test-utils';

const alluvialChartTestSuiteFactory = (data: any = DATASETS.Basic.data) => new BaseTestSuite(AdvAlluvialChart, { data });

describe('adv-alluvial-chart.vue', () => {
  test('mounts component and sets prop values', async () => {
    
    const testSuite = alluvialChartTestSuiteFactory();

    const wrapper = testSuite.run().wrapper;
    const el = wrapper.find('[data-j-alluvial-chart]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group]').exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__ghost-path]').exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__path]').exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__node-block]').exists()).toBeFalsy();
  });

  test('mounts component and sets prop values using random data', async () => {
    const data = generateData();
    const testSuite = alluvialChartTestSuiteFactory(data);

    const wrapper = testSuite.run().wrapper;
    const el = wrapper.find('[data-j-alluvial-chart]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group]').exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__ghost-path]').exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__path]').exists()).toBeTruthy();
    expect(el.find('[data-j-alluvial-group__node-block]').exists()).toBeFalsy();
  });

  test('should throw error in case of a dataset with circular links', async () => {
    // Suppress error output to the console
    const originalError = console.error;
    console.error = jest.fn();

    const values = [
      { label: 'A', color: '01', value: 'A', targets: [{ node: 'B', value: 50 }] },
      { label: 'B', color: '02', value: 'B', targets: [{ node: 'A', value: 50 }] },
    ];

    const [baseData] = generateData();
    const data = [{
      ...baseData,
      values
    }];

    const t = () =>
      mount(AdvAlluvialChart, {
        propsData: {
          data
        }
      });

    expect(t).toThrow('circular link');

    // Restore default error output setting
    console.error = originalError;
  });

  // Test to see what happens when we specify empty dataset
  // Test to see what happens when we specify single node
  // Test to see what happens when we specify only nodes with no edges
  // Test to see what happens when we specify an edge to a non-existing node
  // Test interaction with elements
});