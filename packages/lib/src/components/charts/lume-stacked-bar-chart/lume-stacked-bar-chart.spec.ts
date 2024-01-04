import StackedBarChart from './lume-stacked-bar-chart.vue';

import { BaseTestSuite } from '@test/unit/reusable.test';
import {
  data,
  generateData,
  generateLinearScale,
  labels,
  xScale,
  yScale,
} from '@test/unit/mock-data';

import { CHART_TYPES, ChartType, Orientation } from '@/utils/constants';

const orientation: Orientation = 'horizontal';
const chartType: ChartType = CHART_TYPES.BAR;
const numberOfBars = data[0].values.length;

const stackedBarChartTestSuiteFactory = (props) =>
  new BaseTestSuite(StackedBarChart, props);

describe('lume-stacked-bar-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = stackedBarChartTestSuiteFactory({
      data,
      labels,
      chartType,
    }).wrapper;

    const el = wrapper.find('[data-j-stacked-bar-chart]');
    expect(el.exists()).toBeTruthy();

    const barsGroupComponent = el.findComponent('[data-j-bars-group]');
    expect(barsGroupComponent.exists()).toBeTruthy();
    expect(barsGroupComponent.props('orientation')).toEqual('vertical');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfBars);
  });

  test('mounts component and sets custom orientation', () => {
    const wrapper = stackedBarChartTestSuiteFactory({
      data,
      labels,
      orientation,
      chartType,
    }).wrapper;

    const el = wrapper.findComponent('[data-j-bars-group]');
    expect(el.props('orientation')).toEqual('horizontal');
  });

  test('mounts component with double dataset', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length);
    const manipulatedDataLinearScale = generateLinearScale(manipulatedData);
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = stackedBarChartTestSuiteFactory({
      data: manipulatedData,
      labels,
      yScale: manipulatedDataLinearScale,
      chartType,
    }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  test('mounts component with double dataset and custom orientation', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length);
    const manipulatedDataLinearScale = generateLinearScale(manipulatedData);
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = stackedBarChartTestSuiteFactory({
      data: manipulatedData,
      labels,
      yScale: xScale,
      xScale: manipulatedDataLinearScale,
      orientation,
      chartType,
    }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  test('mounts component with double dataset with negative values', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(
      numberOfSets,
      data[0].values.length,
      1000,
      false,
      true
    );
    const manipulatedDataLinearScale = generateLinearScale(manipulatedData);
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = stackedBarChartTestSuiteFactory({
      data: manipulatedData,
      labels,
      yScale: manipulatedDataLinearScale,
      chartType,
    }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  test('mounts component with double dataset and custom orientation with negative values', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(
      numberOfSets,
      data[0].values.length,
      1000,
      false,
      true
    );
    const manipulatedDataLinearScale = generateLinearScale(manipulatedData);
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = stackedBarChartTestSuiteFactory({
      data: manipulatedData,
      labels,
      yScale: xScale,
      xScale: manipulatedDataLinearScale,
      orientation,
      chartType,
    }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(
      numberOfSets * numberOfBars
    );
  });

  const testSuite = stackedBarChartTestSuiteFactory({
    data: [{ values: [] }],
    labels,
    chartType,
  });
  testSuite.run({ selector: '[data-j-lume-bar]', multisetData: [3, 7, 4, 5] });
});
