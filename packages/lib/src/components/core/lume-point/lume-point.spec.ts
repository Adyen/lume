import { mount } from '@vue/test-utils';

import LumePoint from '@/components/core/lume-point';

const props = { x: 50, y: 50 };

document.body.innerHTML = `<svg id="root"></svg>`; // prevent no SVG parent console.warn

describe('chart-container.vue', () => {
  test('mounts component', () => {
    const wrapper = mount(LumePoint, {
      attachTo: '#root',
      props,
      propsData: props,
    });

    const el = wrapper.find('[data-j-point]');
    expect(el.exists()).toBeTruthy();
  });

  test('mounts component with active set to true', () => {
    const defaultRadius = '4';
    const active = true;
    const wrapper = mount(LumePoint, {
      attachTo: '#root',
      props: { ...props, active },
      propsData: { ...props, active },
    });

    const el = wrapper.find('[data-j-point]');
    expect(el.attributes()['r']).toEqual(defaultRadius);
  });

  test('mounts component with active set to true and default radius', () => {
    const radius = 10;
    const active = true;
    const wrapper = mount(LumePoint, {
      attachTo: '#root',
      props: { ...props, radius, active },
      propsData: { ...props, radius, active },
    });

    const el = wrapper.find('[data-j-point]');
    expect(el.attributes()['r']).toEqual(radius.toString());
  });

  test('mounts component with custom color', () => {
    const color = '02';
    const wrapper = mount(LumePoint, {
      attachTo: '#root',
      props: { ...props, color },
      propsData: { ...props, color },
    });

    const el = wrapper.find('[data-j-point]');
    expect(el.classes().includes(`lume-stroke--${color}`)).toBe(true);
  });

  describe('Events API', () => {
    it('should dispatch `click` if user clicks the point circle', async () => {
      const wrapper = mount(LumePoint, {
        attachTo: '#root',
        props,
        propsData: props,
      });

      const circle = wrapper.find('circle.lume-point');

      await circle.trigger('click');

      expect(wrapper.emitted()).toHaveProperty('click');
      expect(wrapper.emitted().click).toHaveLength(1);
    });
  });
});
