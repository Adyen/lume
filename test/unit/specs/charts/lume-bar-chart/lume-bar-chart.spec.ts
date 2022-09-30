import flushPromises from 'flush-promises';
import {
  generateData,
  labels,
  data as singleSetData,
  xScale,
  yScale,
} from '../../mock-data';
import BarChart from '@/components/charts/lume-bar-chart';
import { BaseTestSuite } from '../../../reusable.test';

const numberOfSets = 2;
const numberOfBars = singleSetData[0].values.length;
const multiSetData = generateData(numberOfSets, singleSetData[0].values.length);

const barChartTestSuiteFactory = (propsData) =>
  new BaseTestSuite(BarChart, propsData);

describe('lume-bar-chart.vue', () => {
  test('mounts component and sets prop values', async () => {
    const wrapper = await barChartTestSuiteFactory({
      data: singleSetData,
      labels,
      xScale,
      yScale,
    }).run().wrapper;

    await flushPromises();

    expect(wrapper.find('[data-j-lume-bar-chart]')).toBeTruthy();
  });

  test.skip('should display single bar chart', async () => {
    const wrapper = await barChartTestSuiteFactory({
      data: singleSetData,
      labels,
      xScale,
      yScale,
    }).wrapper;

    await flushPromises();

    const el = wrapper.find('[data-j-single-bar-chart]');

    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfBars);
  });

  test('should display grouped bar chart', async () => {
    const type = 'grouped';

    const wrapper = await barChartTestSuiteFactory({
      data: multiSetData,
      type,
      labels,
      xScale,
      yScale,
    }).wrapper;

    await flushPromises();

    const el = wrapper.find('[data-j-grouped-bar-chart]');

    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  test('should display stacked bar chart', async () => {
    const type = 'stacked';

    const wrapper = await barChartTestSuiteFactory({
      data: multiSetData,
      type,
      labels,
      xScale,
      yScale,
    }).wrapper;

    await flushPromises();

    const el = wrapper.find('[data-j-stacked-bar-chart]');

    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(
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
});
