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

  test.skip('should throw error in case of a dataset with circular edges', async () => {
    const values = [
      { label: 'A', color: '01', value: 'A', targets: [{ node: 'B', value: 50 }] },
      { label: 'B', color: '02', value: 'B', targets: [{ node: 'A', value: 50 }] },
    ];

    const baseData = generateData();
    const data = [{
      ...baseData[0],
      values
    }];

    const t = () => mount(AdvAlluvialChart, {
      propsData: {
        data
      }
    });

    expect(t).toThrowError('Cannot read property \'nodeBlocks\' of undefined');
    expect(t).toThrow('circular link');
  });
});