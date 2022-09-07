import { mount } from '@vue/test-utils';
import { data, generateData, generateLinearScale, labels, xScale, yScale } from '../../mock-data';
import AdvLineChart from '@/charts/adv-line-chart/adv-line-chart.vue';

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

  test('mounts component and dynamically changes datasets', async () => {
    const firstNumberOfSets = 3;
    const firstNumberOfRecords = 7;
    const secondNumberOfSets = 4;
    const secondNumberOfRecords = 5;
    const firstDataSet = generateData(firstNumberOfSets, firstNumberOfRecords);
    const secondDataSet = generateData(secondNumberOfSets, secondNumberOfRecords);

    const wrapper = mount(AdvLineChart, {
      // Note that we need to flip the scales so as to feed band and linear scales correctly
      propsData: { data: firstDataSet, labels, yScale, xScale }
    });

    expect(wrapper.findAll('[data-j-line]')).toHaveLength(firstNumberOfSets * firstNumberOfRecords);
    await wrapper.setProps({ data: secondDataSet });
    expect(wrapper.findAll('[data-j-line]')).toHaveLength(secondNumberOfSets * secondNumberOfRecords);
    await wrapper.setProps({ data: [{ values: [] }] });
    expect(wrapper.findAll('[data-j-line]')).toHaveLength(0);
    await wrapper.setProps({ data: secondDataSet });
    expect(wrapper.findAll('[data-j-line]')).toHaveLength(secondNumberOfSets * secondNumberOfRecords);
  })
});
