import { mount } from '@vue/test-utils';
import { scaleBand } from 'd3';

import LumeAxis from './lume-axis.vue';

import { labels } from '@test/unit/mock-data';

import { Scale } from '@/composables/scales';
import { nextTick } from 'vue';

const width = 640;
const scale: Scale = scaleBand<number>()
  .domain(labels.map((_, i) => i))
  .range([0, width]);

describe('lume-axis.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeAxis, {
      props: {
        scale,
      },
    });

    const el = wrapper.find('[data-j-axis]');
    expect(el.exists()).toBeTruthy();
    const ticks = wrapper.findAll('[data-j-axis__tick]');
    expect(el.exists()).toBeTruthy();
    expect(ticks).toHaveLength(7);
    expect(wrapper.emitted('mouseover')).toBeFalsy();
  });

  test('mounts component and sets custom value for skip option to false', () => {
    const wrapper = mount(LumeAxis, {
      props: {
        scale,
        options: { skip: false },
      },
    });

    expect(
      wrapper
        .findAll('[data-j-axis__tick]')
        .filter((record) => record.classes().includes('axis__tick--hidden'))
    ).toHaveLength(0);
  });

  test('mounts component and sets custom value for skip option to 2', async () => {
    const skip = 2;
    const wrapper = mount(LumeAxis, {
      props: {
        scale,
        options: { skip },
      },
    });

    await nextTick();

    expect(
      wrapper
        .findAll('[data-j-axis__tick]')
        .filter((record) => record.classes().includes('axis__tick--hidden'))
    ).toHaveLength(Math.ceil(labels.length / skip));
  });

  describe('Events API', () => {
    it('should dispatch `click` if user clicks an axis tick', async () => {
      const wrapper = mount(LumeAxis, { props: { scale } });

      const ticks = wrapper.findAll('[data-j-axis__tick=""]');

      await ticks[0].trigger('click');
      await ticks[3].trigger('click');

      expect(wrapper.emitted()).toHaveProperty('click');
      expect(wrapper.emitted().click).toHaveLength(2);
    });

    it('should dispatch `mouseenter` if user mouses over an axis tick', async () => {
      const wrapper = mount(LumeAxis, { props: { scale } });

      const ticks = wrapper.findAll('[data-j-axis__tick=""]');

      await ticks[0].trigger('mouseenter');
      await ticks[3].trigger('mouseenter');

      expect(wrapper.emitted()).toHaveProperty('mouseenter');
      expect(wrapper.emitted().mouseenter).toHaveLength(2);
    });

    it('should dispatch `mouseleave` if user moves mouse away from an axis', async () => {
      const wrapper = mount(LumeAxis, { props: { scale } });

      await wrapper.trigger('mouseleave');

      expect(wrapper.emitted()).toHaveProperty('mouseleave');
      expect(wrapper.emitted().mouseleave).toHaveLength(1);
    });
  });
});
