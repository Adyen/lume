import { data, generateData, generateLinearScale, labels, xScale, yScale } from '../../mock-data';
import StackedBarChart from '@/charts/adv-stacked-bar-chart/adv-stacked-bar-chart.vue';
import { BaseTestSuite } from '../../../reusable.test';
import { Orientation } from '@/constants';

const orientation: Orientation = 'horizontal';
const numberOfBars = data[0].values.length;

const stackedBarChartFactory = (propsData) => new BaseTestSuite(StackedBarChart, propsData);

describe('adv-stacked-bar-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = stackedBarChartFactory({ data, labels, xScale, yScale }).wrapper;

    const el = wrapper.find('[data-j-stacked-bar-chart]')
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-bars-group]').exists()).toBeTruthy();
    const barsGroupComponent = el.find('[data-j-bars-group]');
    expect(barsGroupComponent.props('orientation')).toEqual('vertical');
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfBars);
  });

  test('mounts component and sets custom orientation', () => {
    const wrapper = stackedBarChartFactory({ data, labels, xScale, yScale, orientation }).wrapper;

    const el = wrapper.find('[data-j-bars-group]')
    expect(el.props('orientation')).toEqual('horizontal');
  });

  test('mounts component with double dataset', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length)
    const manipulatedDataLinearScale = generateLinearScale(manipulatedData);
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = stackedBarChartFactory({ data: manipulatedData, labels, xScale, yScale: manipulatedDataLinearScale }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  test('mounts component with double dataset and custom orientation', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length)
    const manipulatedDataLinearScale = generateLinearScale(manipulatedData);
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = stackedBarChartFactory({ data: manipulatedData, labels, yScale: xScale, xScale: manipulatedDataLinearScale, orientation }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  test('mounts component with double dataset with negative values', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length, 1000, false, true);
    const manipulatedDataLinearScale = generateLinearScale(manipulatedData);
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = stackedBarChartFactory({ data: manipulatedData, labels, xScale, yScale: manipulatedDataLinearScale }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  test('mounts component with double dataset and custom orientation with negative values', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length, 1000, false, true);
    const manipulatedDataLinearScale = generateLinearScale(manipulatedData);
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    const wrapper = stackedBarChartFactory({ data: manipulatedData, labels, yScale: xScale, xScale: manipulatedDataLinearScale, orientation }).wrapper;

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfSets * numberOfBars);
  });

  const testSuite = stackedBarChartFactory({ data: [{ values: [] }], labels, xScale, yScale });
  testSuite.run();
  testSuite.multiDataSetTest('[data-j-adv-bar]', 3, 7, 4, 5);
});
