import {
  data as singleSetData,
  generateData,
  labels,
  xScale,
  yScale,
} from '../../mock-data';
import BarChart from '@/charts/adv-bar-chart';
import { BaseTestSuite } from '../../../reusable.test';

const numberOfSets = 2;
const numberOfBars = singleSetData[0].values.length;
const multiSetData = generateData(numberOfSets, singleSetData[0].values.length);

const barChartTestSuiteFactory = (propsData) => new BaseTestSuite(BarChart, propsData);

describe('adv-bar-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = barChartTestSuiteFactory({
      data: singleSetData,
      labels,
      xScale,
      yScale,
    }).wrapper;

    expect(wrapper.find('[data-j-adv-bar-chart]')).toBeTruthy();
  });

  test('should display single bar chart', () => {
    const wrapper = barChartTestSuiteFactory({
      data: singleSetData,
      labels,
      xScale,
      yScale,
    }).wrapper;

    const el = wrapper.find('[data-j-single-bar-chart]');
    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfBars);
  });

  test.skip('should display grouped bar chart', () => {
    const type = 'grouped';

    const wrapper = barChartTestSuiteFactory({
      data: multiSetData,
      type,
      labels,
      xScale,
      yScale,
    }).wrapper;

    const el = wrapper.find('[data-j-grouped-bar-chart]');

    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  test.skip('should display stacked bar chart', () => {
    const type = 'stacked';

    const wrapper = barChartTestSuiteFactory({
      data: multiSetData,
      type,
      labels,
      xScale,
      yScale,
    }).wrapper;

    const el = wrapper.find('[data-j-stacked-bar-chart]');

    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  test('should throw an error when type is not applied for multiset', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(jest.fn);
    expect(() =>
      barChartTestSuiteFactory({ data: multiSetData, labels, xScale, yScale })
    ).toThrowError("Bar chart needs a type when there's multiple datasets.");
    expect(spy).toHaveBeenCalled();
  });

  const testSuite = barChartTestSuiteFactory({
    data: singleSetData,
    labels,
    xScale,
    yScale,
  });
  testSuite.run();
});
