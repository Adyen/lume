import { mount } from '@vue/test-utils';

import LumeLine from './lume-line.vue';

import { getLinePathDefinition } from '@/composables/line-values';

import { data, xScale, yScale } from '@test/unit/mock-data';

const pathDefinition = getLinePathDefinition(
  1,
  [data[0].values[0].value, data[0].values[1].value],
  xScale,
  yScale
);

const props = { pathDefinition: pathDefinition.value, xScale };

document.body.innerHTML = `<svg id="root"></svg>`; // prevent no SVG parent console.warn

describe('lume-line.vue', () => {
  test('mounts component', () => {
    const wrapper = mount(LumeLine, { attachTo: '#root', props });

    const el = wrapper.find('[data-j-line]');
    expect(el.exists()).toBeTruthy();
    expect(el.classes().includes('lume-line--dashed')).toBe(false);
  });

  test('mounts component and sets dashed line to true', () => {
    const wrapper = mount(LumeLine, {
      attachTo: '#root',
      props: { ...props, dashed: true },
      propsData: { ...props, dashed: true },
    });

    const el = wrapper.find('[data-j-line]');
    expect(el.classes().includes('lume-line--dashed')).toBe(true);
    expect(el.classes().includes(`lume-stroke--skyblue`)).toBe(true);
  });

  test('mounts component with custom color', () => {
    const color = '02';
    const wrapper = mount(LumeLine, {
      attachTo: '#root',
      props: { ...props, color },
      propsData: { ...props, color },
    });

    const el = wrapper.find('[data-j-line]');
    expect(el.classes().includes(`lume-stroke--${color}`)).toBe(true);
  });

  describe('Events API', () => {
    it('should dispatch `click` if user clicks a line', async () => {
      const wrapper = mount(LumeLine, {
        attachTo: '#root',
        props,
        propsData: props,
      });

      const line = wrapper.find('path.lume-line');

      await line.trigger('click');

      expect(wrapper.emitted()).toHaveProperty('click');
      expect(wrapper.emitted().click).toHaveLength(1);
    });
  });
});
