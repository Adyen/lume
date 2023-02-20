import LumeLineChart from '@/components/charts/lume-line-chart/lume-line-chart.vue';

import { BaseTestSuite } from '@test/unit/reusable.test';
import {
  data,
  generateData,
  generateLinearScale,
  labels,
  xScale,
  yScale,
} from '@test/unit/mock-data';

const numberOfLines = data[0].values.length;
const lineChartTestSuiteFactory = (propsData) =>
  new BaseTestSuite(LumeLineChart, propsData);

describe('lume-line-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = lineChartTestSuiteFactory({
      data,
      labels,
      xScale,
      yScale,
    }).wrapper;

    const el = wrapper.find('[data-j-lume-line-chart]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-lume-line-group]').exists()).toBeTruthy();
    expect(el.findAll('[data-j-line]')).toHaveLength(numberOfLines);
  });

  test('mounts component and sets prop with two datasets', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length);
    const linearScale = generateLinearScale(manipulatedData);
    const wrapper = lineChartTestSuiteFactory({
      data: manipulatedData,
      labels,
      xScale,
      yScale: linearScale,
    }).wrapper;

    const elements = wrapper.findAll('[data-j-line]');
    expect(elements).toHaveLength(numberOfSets * numberOfLines);
  });

  const testSuite = lineChartTestSuiteFactory({
    data: [{ values: [] }],
    labels,
    xScale,
    yScale,
  });
  testSuite.run({ selector: '[data-j-line]', multisetData: [3, 7, 4, 5] });
});
