import { mount } from '@vue/test-utils';
import { data, xScale, yScale } from '../../mock-data';
import Line from '@/core/lume-line';

const propsData = { index: 0, values: data[0].values, xScale, yScale };

describe('chart-container.vue', () => {
  test('mounts component', () => {
    const wrapper = mount(Line, { propsData })

    const el = wrapper.find('[data-j-line]');
    expect(el.exists()).toBeTruthy();
    expect(el.classes().includes('lume-line--dashed')).toBe(false)
  });

  test('mounts component and sets dashed line to true', () => {
    const wrapper = mount(Line, { propsData: { ...propsData, dashed: true } })

    const el = wrapper.find('[data-j-line]');
    expect(el.classes().includes('lume-line--dashed')).toBe(true)
    expect(el.classes().includes(`lume-stroke--01`)).toBe(true)
  });

  test('mounts component with custom color', () => {
    const color = '02';
    const wrapper = mount(Line, { propsData: { ...propsData, color } })

    const el = wrapper.find('[data-j-line]');
    expect(el.classes().includes(`lume-stroke--${color}`)).toBe(true)
  });
});