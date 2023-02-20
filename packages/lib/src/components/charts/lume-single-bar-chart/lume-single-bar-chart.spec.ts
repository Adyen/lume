import SingleBarChart from './lume-single-bar-chart.vue';

import { BaseTestSuite } from '@test/unit/reusable.test';
import { data, labels, xScale, yScale } from '@test/unit/mock-data';

const numberOfPositiveBars = 5;
const numberOfNegativeBars = 2;
const totalNumberOfBars = data[0].values.length;

const singleBarChartTestSuiteFactory = (propsData) =>
  new BaseTestSuite(SingleBarChart, propsData);

describe('lume-single-bar-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = singleBarChartTestSuiteFactory({
      data,
      labels,
      xScale,
      yScale,
    }).wrapper;

    const el = wrapper.find('[data-j-single-bar-chart]');
    const props = wrapper.vm.$props;
    expect(el.exists()).toBeTruthy();
    expect(props).toHaveProperty('data');
    expect(props.data).toEqual(data);
    expect(props).toHaveProperty('labels');
    expect(props.labels).toEqual(labels);
    expect(props).toHaveProperty('xScale');
    expect(props.xScale).toEqual(xScale);
    expect(props).toHaveProperty('yScale');
    expect(props.yScale).toEqual(yScale);

    expect(props).toHaveProperty('options');
    expect(props.options).toEqual({});
    expect(props).toHaveProperty('orientation');
    expect(props.orientation).toEqual('vertical');
    expect(props).toHaveProperty('title');
    expect(props.title).toEqual(null);

    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(totalNumberOfBars);
  });

  test('should display single bar chart with positive, negative and null bars', () => {
    const wrapper = singleBarChartTestSuiteFactory({
      data,
      labels,
      xScale,
      yScale,
    }).wrapper;

    const el = wrapper.find('[data-j-single-bar-chart]');

    // check +ve bars
    expect(
      el.findAll('[data-j-lume-bar]').at(0).props('isNegative')
    ).toBeFalsy();
    expect(
      el.findAll('[data-j-lume-bar]').at(2).props('isNegative')
    ).toBeFalsy();
    expect(
      el.findAll('[data-j-lume-bar]').at(3).props('isNegative')
    ).toBeFalsy();
    expect(
      el.findAll('[data-j-lume-bar]').at(6).props('isNegative')
    ).toBeFalsy();
    expect(
      el
        .findAll('[data-j-lume-bar]')
        .filter((item) => !item.props('isNegative'))
    ).toHaveLength(numberOfPositiveBars);
    // check -ve bars
    expect(
      el.findAll('[data-j-lume-bar]').at(1).props('isNegative')
    ).toBeTruthy();
    expect(
      el.findAll('[data-j-lume-bar]').at(4).props('isNegative')
    ).toBeTruthy();
    expect(
      el.findAll('[data-j-lume-bar]').filter((item) => item.props('isNegative'))
    ).toHaveLength(numberOfNegativeBars);
    // check null bars
    expect(
      el.findAll('[data-j-lume-bar]').at(5).props('isNegative')
    ).toBeFalsy();
  });

  test('should not display any bar with empty dataset', () => {
    const data = [
      {
        values: [],
      },
    ];

    const labels = [];

    const wrapper = singleBarChartTestSuiteFactory({
      data,
      labels,
      xScale,
      yScale,
    }).wrapper;

    const el = wrapper.find('[data-j-single-bar-chart]');

    expect(el.findAll('[data-j-lume-bar]')).toHaveLength(0);
  });

  const testSuite = singleBarChartTestSuiteFactory({
    data: [{ values: [] }],
    labels,
    xScale,
    yScale,
  });
  testSuite.run({ selector: '[data-j-lume-bar]', multisetData: [1, 7, 1, 5] });
});