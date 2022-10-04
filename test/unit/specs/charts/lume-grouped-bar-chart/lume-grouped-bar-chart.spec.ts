import { data, generateData, generateLinearScale, labels, xScale, yScale } from '../../mock-data';
import GroupedBarChart from '../../../../../src/charts/lume-grouped-bar-chart/lume-grouped-bar-chart.vue';
import { Orientation } from '@/constants';
import { BaseTestSuite } from "../../../reusable.test";

const orientation: Orientation = 'horizontal';
const numberOfBars = data[0].values.length;

const groupedBarChartTestSuiteFactory = (propsData) => new BaseTestSuite(GroupedBarChart, propsData);

describe('lume-grouped-bar-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = groupedBarChartTestSuiteFactory({ data, labels, xScale, yScale }).wrapper;

    const el = wrapper.find('[data-j-grouped-bar-chart]')
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-bars-group]').exists()).toBeTruthy();
    const barsGroupComponent = el.find('[data-j-bars-group]');
    expect(barsGroupComponent.props('orientation')).toEqual('vertical');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfBars);
  });

  test('mounts component and sets custom orientation', () => {
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = groupedBarChartTestSuiteFactory({ data, labels, yScale: xScale, xScale: yScale, orientation }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.props('orientation')).toEqual('horizontal');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfBars);
  });

  test('mounts component with double dataset', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length)
    const linearScale = generateLinearScale(manipulatedData)
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = groupedBarChartTestSuiteFactory({ data: manipulatedData, labels, xScale, yScale: linearScale }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  test('mounts component with double dataset and custom orientation', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length)
    const linearScale = generateLinearScale(manipulatedData)
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = groupedBarChartTestSuiteFactory({ data: manipulatedData, labels, yScale: xScale, xScale: linearScale, orientation }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  test('mounts component with double dataset with negative values', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length, 1000, false, true)
    const linearScale = generateLinearScale(manipulatedData)
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = groupedBarChartTestSuiteFactory({ data: manipulatedData, labels, xScale, yScale: linearScale }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  test('mounts component with double dataset and custom orientation with negative values', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length, 1000, false, true)
    const linearScale = generateLinearScale(manipulatedData)
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = groupedBarChartTestSuiteFactory({ data: manipulatedData, labels, yScale: xScale, xScale: linearScale, orientation }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });
  
  const testSuite = groupedBarChartTestSuiteFactory({ data: [{ values: [] }], labels, xScale, yScale });
  testSuite.run({ selector: '[data-j-lume-bar]', multisetData: [3, 7, 4, 5] });
});
