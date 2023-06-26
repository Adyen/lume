import { mount } from '@vue/test-utils';

import LumeBarGroup from './lume-bar-group.vue';

import { data, xScale, yScale } from '@test/unit/mock-data';

import { Orientation } from '@/utils/constants';

const orientation: Orientation = 'horizontal';

const defaultProps = {
  data,
  xScale,
  yScale,
};

document.body.innerHTML = `<svg id="root"></svg>`; // prevent no SVG parent console.warn

describe('bar-group.vue', () => {
  test('mounts component', () => {
    const wrapper = mount(LumeBarGroup, {
      attachTo: '#root',
      props: defaultProps,
      propsData: defaultProps,
    });

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.exists()).toBeTruthy();
    expect(wrapper.find('[data-j-lume-bar]').attributes('x')).not.toEqual('0');
    expect(
      wrapper
        .find('[data-j-lume-bar]')
        .attributes()
        .class.includes('lume-fill--skyblue')
    ).toBe(true);
  });

  test('mounts component with horizontal orientation', () => {
    const wrapper = mount(LumeBarGroup, {
      attachTo: '#root',
      props: {
        data,
        xScale: yScale,
        yScale: xScale,
        orientation,
      },
      propsData: {
        data,
        xScale: yScale,
        yScale: xScale,
        orientation,
      },
    });

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.exists()).toBeTruthy();
    expect(wrapper.find('[data-j-lume-bar]').attributes('x')).toEqual('0');
  });

  describe('Events API', () => {
    it('should dispatch `bar-click` if user clicks a bar', async () => {
      const wrapper = mount(LumeBarGroup, {
        attachTo: '#root',
        props: defaultProps,
        propsData: defaultProps,
      });

      const bars = wrapper.findAll('[data-j-lume-bar=""]');

      await bars.at(0).trigger('click');
      await bars.at(2).trigger('click');

      expect(wrapper.emitted()).toHaveProperty('bar-click');
      expect(wrapper.emitted()['bar-click']).toHaveLength(2);
      expect(wrapper.emitted()['bar-click'][0][0].index).toBe(0);
      expect(wrapper.emitted()['bar-click'][1][0].index).toBe(2);
    });
  });
});
