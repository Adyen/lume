import { data, generateData, generateLinearScale, labels, xScale, yScale } from '../../mock-data';
import AdvLineChart from '@/charts/adv-line-chart/adv-line-chart.vue';
import { BaseTestSuite } from "../../../reusable.test";

const numberOfLines = data[0].values.length;
const lineChartTestSuiteFactory = (propsData) => new BaseTestSuite(AdvLineChart, propsData);

describe('adv-line-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = lineChartTestSuiteFactory({ data, labels, xScale, yScale }).wrapper;

    const el = wrapper.find('[data-j-adv-line-chart]')
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-adv-line-group]').exists()).toBeTruthy();
    expect(el.findAll('[data-j-line]')).toHaveLength(numberOfLines);
  });

  test('mounts component and sets prop with two datasets', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length);
    const linearScale = generateLinearScale(manipulatedData)
    const wrapper = lineChartTestSuiteFactory({ data: manipulatedData, labels, xScale, yScale: linearScale }).wrapper;

    const elements = wrapper.findAll('[data-j-line]');
    expect(elements).toHaveLength(numberOfSets * numberOfLines);
  });

  const testSuite = lineChartTestSuiteFactory({ data: [{ values: [] }], labels, xScale, yScale });
  testSuite.run({ selector: '[data-j-line]', multisetData: [3, 7, 4, 5] });
});
