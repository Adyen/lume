import { mount } from '@vue/test-utils';
import { data, labels, xScale, yScale, generateData } from '../../mock-data';
import SingleBarChart from '@/charts/adv-single-bar-chart/adv-single-bar-chart.vue';
import { testDynamicBehaviour } from "../../../reusable.test";

const numberOfPositiveBars = 5;
const numberOfNegativeBars = 2;
const totalNumberOfBars = data[0].values.length;

describe('adv-single-bar-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(SingleBarChart, {
      propsData: { data, labels, xScale, yScale }
    });

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

    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(totalNumberOfBars);
  });

  test('should display single bar chart with positive, negative and null bars', () => {
    const wrapper = mount(SingleBarChart, {
      propsData: { data, labels, xScale, yScale }
    });

    const el = wrapper.find('[data-j-single-bar-chart]');

    // check +ve bars
    expect(el.findAll('[data-j-adv-bar]').at(0).props('isNegative')).toBeFalsy();
    expect(el.findAll('[data-j-adv-bar]').at(2).props('isNegative')).toBeFalsy();
    expect(el.findAll('[data-j-adv-bar]').at(3).props('isNegative')).toBeFalsy();
    expect(el.findAll('[data-j-adv-bar]').at(6).props('isNegative')).toBeFalsy();
    expect(el.findAll('[data-j-adv-bar]').filter((item) => !item.props('isNegative'))).toHaveLength(numberOfPositiveBars);
    // check -ve bars
    expect(el.findAll('[data-j-adv-bar]').at(1).props('isNegative')).toBeTruthy();
    expect(el.findAll('[data-j-adv-bar]').at(4).props('isNegative')).toBeTruthy();
    expect(el.findAll('[data-j-adv-bar]').filter((item) => item.props('isNegative'))).toHaveLength(numberOfNegativeBars);
    // check null bars
    expect(el.findAll('[data-j-adv-bar]').at(5).props('isNegative')).toBeFalsy();
  });

  test('should not display any bar with empty dataset', () => {
    const data = [{
      values: []
    }];

    const labels = [];

    const wrapper = mount(SingleBarChart, {
      propsData: { data, labels, xScale, yScale }
    });

    const el = wrapper.find('[data-j-single-bar-chart]');

    expect(el.findAll('[data-j-adv-bar]')).toHaveLength(0);
  })

  testDynamicBehaviour(
      SingleBarChart,
      '[data-j-adv-bar]',
      1,
      7,
      1,
      5
  );
});
