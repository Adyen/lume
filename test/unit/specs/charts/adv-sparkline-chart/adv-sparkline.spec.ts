import { shallowMount } from '@vue/test-utils';
import { data, labels, xScale, yScale } from '../../mock-data';
import AdvSparkline from '@/charts/adv-sparkline-chart/adv-sparkline.vue';
import { options as defaultOptions } from '@/charts/adv-sparkline-chart/defaults';

describe('adv-sparkline.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = shallowMount(AdvSparkline, {
      propsData: { data, labels, options: defaultOptions },
    });

    const el = wrapper.findComponent(AdvSparkline);
    const props = wrapper.props();

    expect(el.exists()).toBe(true);

    expect(props).toHaveProperty('data');
    expect(props.data).toEqual(data);
    expect(props).toHaveProperty('labels');
    expect(props.labels).toEqual(labels);
    expect(props).toHaveProperty('options');
    expect(props.options).toEqual(defaultOptions);

    const areaPath = el.find('[data-j-sparkline__area]');
    expect(areaPath.exists()).toBe(true);
    expect(areaPath.classes().includes(`sparkline-chart__area--color-01`)).toBe(
      true
    );

    expect(wrapper.vm.$data).not.toHaveProperty('areaPathDefinition');
  });

  test('mounts component and sets custom area color', async () => {
    const areaColor = '02';
    const mutatedData = JSON.parse(JSON.stringify(data));
    mutatedData[0].areaColor = areaColor;

    const wrapper = shallowMount(AdvSparkline, {
      propsData: { data: mutatedData, labels },
    });

    const el = wrapper.findComponent(AdvSparkline);

    const areaPath = el.find('[data-j-sparkline__area]');

    expect(
      areaPath.classes().includes(`sparkline-chart__area--color-${areaColor}`)
    ).toBe(true);
  });

  test('mounts component and sets custom area color', async () => {
    const wrapper = await shallowMount(AdvSparkline, {
      propsData: { data, labels, xScale, yScale },
    });

    expect(wrapper.vm.$data).toHaveProperty('areaPathDefinition');
    expect(wrapper.vm.$data.areaPathDefinition(xScale, null)).toBeFalsy();
    expect(wrapper.vm.$data.areaPathDefinition(xScale, yScale)).toBeTruthy();
  });
});
