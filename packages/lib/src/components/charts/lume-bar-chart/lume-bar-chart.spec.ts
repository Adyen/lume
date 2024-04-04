import BarChart from './lume-bar-chart.vue';

import { BaseTestSuite } from '@test/unit/reusable.test';
import {
  generateData,
  labels,
  data as singleSetData,
  xScale,
  yScale,
} from '@test/unit/mock-data';
import { flushPromises } from '@test/unit/flush-promises';
import { CHART_TYPES } from '@/utils/constants';
import type { ChartType } from '@/types/utils';

const numberOfSets = 2;
const numberOfBars = singleSetData[0].values.length;
const multiSetData = generateData(numberOfSets, singleSetData[0].values.length);
const chartType: ChartType = CHART_TYPES.BAR;

const barChartTestSuiteFactory = (props) => new BaseTestSuite(BarChart, props);

describe('lume-bar-chart.vue', () => {
  test('mounts component and sets prop values', async () => {
    const wrapper = barChartTestSuiteFactory({
      data: singleSetData,
      labels,
      xScale,
      yScale,
      chartType,
    }).run().wrapper;

    await flushPromises();

    expect(wrapper.find('[data-j-lume-bar-chart]')).toBeTruthy();
  });

  test.skip('should display single bar chart', async () => {
    const wrapper = barChartTestSuiteFactory({
      data: singleSetData,
      labels,
      xScale,
      yScale,
      chartType,
    }).wrapper;

    await flushPromises();

    const el = wrapper.find('[data-j-single-bar-chart]');

    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfBars);
  });

  test.skip('should display grouped bar chart', async () => {
    const type = 'grouped';

    const wrapper = barChartTestSuiteFactory({
      data: multiSetData,
      type,
      labels,
      xScale,
      yScale,
      chartType,
    }).wrapper;

    await flushPromises();

    const el = wrapper.find('[data-j-grouped-bar-chart]');

    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  test.skip('should display stacked bar chart', async () => {
    const type = 'stacked';

    const wrapper = barChartTestSuiteFactory({
      data: multiSetData,
      type,
      labels,
      xScale,
      yScale,
      chartType,
    }).wrapper;

    await flushPromises();

    const el = wrapper.find('[data-j-stacked-bar-chart]');

    expect(el.exists()).toBeTruthy();
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  test.skip('should throw an error when type is not applied for multiset', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(vi.fn);
    expect(() =>
      barChartTestSuiteFactory({
        data: multiSetData,
        labels,
        xScale,
        yScale,
        chartType,
      })
    ).toThrowError("Bar chart needs a type when there's multiple datasets.");
    expect(spy).toHaveBeenCalled();
  });
});
