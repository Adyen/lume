import { mount } from '@vue/test-utils';

import LumeOverlayGroup from './lume-overlay-group.vue';

import { data, xScale, yScale } from '@test/unit/mock-data';

const defaultProps = { data, xScale, yScale };

document.body.innerHTML = `<svg id="root"></svg>`; // prevent no SVG parent console.warn

describe('lume-overlay-group.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeOverlayGroup, {
      attachTo: '#root',
      props: defaultProps,
      propsData: defaultProps, // for Vue 2 (@vue/test-utils@1)
    });

    const el = wrapper.find('[data-j-lume-overlay-group]');
    expect(el.exists()).toBeTruthy();
  });

  test('emits internal hover event with index', async () => {
    const wrapper = mount(LumeOverlayGroup, {
      attachTo: '#root',
      props: defaultProps,
      propsData: defaultProps, // for Vue 2 (@vue/test-utils@1)
    });

    const bars = wrapper.findAll('.lume-bar');
    console.log(bars, wrapper.html());

    await bars.at(0).trigger('mouseover');
    await bars.at(2).trigger('mouseover');

    expect(wrapper.emitted()).toHaveProperty('lume__internal--hover');

    expect(wrapper.emitted()['lume__internal--hover']).toHaveLength(2);

    expect(wrapper.emitted()['lume__internal--hover'][0][0]).toBe(0);
    expect(wrapper.emitted()['lume__internal--hover'][1][0]).toBe(2);
  });

  describe('Events API', () => {
    it('should dispatch `click` if user clicks a bar', async () => {
      const wrapper = mount(LumeOverlayGroup, {
        attachTo: '#root',
        props: defaultProps,
        propsData: defaultProps, // for Vue 2 (@vue/test-utils@1)
      });

      const bars = wrapper.findAll('.lume-bar');

      await bars.at(0).trigger('click');
      await bars.at(2).trigger('click');

      expect(wrapper.emitted()).toHaveProperty('click');

      expect(wrapper.emitted()['click']).toHaveLength(2);

      expect(wrapper.emitted()['click'][0][0].index).toBe(0);
      expect(wrapper.emitted()['click'][1][0].index).toBe(2);
    });
  });
});
