import { mount } from '@vue/test-utils';

import LumeBarGroup from './lume-bar-group.vue';

import { data, xScale, yScale } from '@test/unit/mock-data';

import type { Orientation } from '@/types/utils';

const orientation: Orientation = 'horizontal';

const defaultProps = {
  data,
  xScale,
  yScale,
};

document.body.innerHTML = `<svg id="root"></svg>`; // prevent no SVG parent console.warn

describe('bar-group.vue', () => {
  const svg = document.getElementById('root');

  test('mounts component', () => {
    const wrapper = mount(LumeBarGroup, { attachTo: svg, props: defaultProps });

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.exists()).toBeTruthy();
    expect(
      wrapper
        .find('[data-j-lume-bar]')
        .attributes()
        .class.includes('lume-fill--skyblue')
    ).toBe(true);
  });

  test('mounts component with horizontal orientation', () => {
    const wrapper = mount(LumeBarGroup, {
      attachTo: svg,
      props: {
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
        attachTo: svg,
        props: defaultProps,
      });

      const bars = wrapper.findAll('[data-j-lume-bar=""]');

      await bars[0].trigger('click');
      await bars[2].trigger('click');

      expect(wrapper.emitted()).toHaveProperty('bar-click');
      expect(wrapper.emitted()['bar-click']).toHaveLength(2);
      expect(wrapper.emitted()['bar-click'][0][0].index).toBe(0);
      expect(wrapper.emitted()['bar-click'][1][0].index).toBe(2);
    });
  });
});
