import { mount } from '@vue/test-utils';
import { data, generateData, generateLinearScale, labels, xScale, yScale } from '../../mock-data';
import AdvLineChart from '@/charts/adv-line-chart/adv-line-chart.vue';
import { testDynamicBehaviour } from "../../../reusable.test";

const numberOfLines = data[0].values.length;

describe('adv-line-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(AdvLineChart, {
      propsData: { data, labels, xScale, yScale }
    });

    const el = wrapper.find('[data-j-adv-line-chart]')
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-adv-line-group]').exists()).toBeTruthy();
    expect(el.findAll('[data-j-line]')).toHaveLength(numberOfLines);
  });

  test('mounts component and sets prop with two datasets', () => {
    const numberOfSets = 2;
    const manipulatedData = generateData(numberOfSets, data[0].values.length);
    const linearScale = generateLinearScale(manipulatedData)
    const wrapper = mount(AdvLineChart, {
      propsData: { data: manipulatedData, labels, xScale, yScale: linearScale }
    });

    const elements = wrapper.findAll('[data-j-line]');
    expect(elements).toHaveLength(numberOfSets * numberOfLines);
  });

  testDynamicBehaviour(
      AdvLineChart,
      '[data-j-line]',
      3,
      7,
      4,
      5
  );
});
