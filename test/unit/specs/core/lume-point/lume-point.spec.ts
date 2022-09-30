import { mount } from '@vue/test-utils';
import { data, xScale, yScale } from '../../mock-data';
import Point from '@/core/lume-point';

const propsData = { index: 0, value: data[0].values[0].value, xScale, yScale };

describe('chart-container.vue', () => {
  test('mounts component', () => {
    const wrapper = mount(Point, { propsData })

    const el = wrapper.find('[data-j-point]');
    expect(el.exists()).toBeTruthy();
  });

  test('mounts component with active set to true', () => {
    const defaultRadius = '4';
    const active = true;
    const wrapper = mount(Point, { propsData: { ...propsData, active } })

    const el = wrapper.find('[data-j-point]');
    expect(el.attributes()['r']).toEqual(defaultRadius);
  });

  test('mounts component with active set to true and default radius', () => {
    const radius = 10;
    const active = true;
    const wrapper = mount(Point, { propsData: { ...propsData, radius, active } })

    const el = wrapper.find('[data-j-point]');
    expect(el.attributes()['r']).toEqual(radius.toString());
  });

  test('mounts component with custom color', () => {
    const color = '02';
    const wrapper = mount(Point, { propsData: { ...propsData, color } })

    const el = wrapper.find('[data-j-point]');
    expect(el.classes().includes(`lume-stroke-color--${color}`)).toBe(true);
  });
});