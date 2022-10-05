import { mount } from '@vue/test-utils';

import LumeOverlayGroup from '@/components/groups/lume-overlay-group';

import { data, xScale, yScale } from '../../mock-data';

const defaultPropsData = { data, xScale, yScale };

describe('lume-line-group.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeOverlayGroup, {
      propsData: defaultPropsData,
    });

    const el = wrapper.find('[data-j-lume-overlay-group]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-lume-overlay-group]').exists()).toBeTruthy();
    expect(true).toBe(true);
  });

  test('emits mouseover event with hovered index', () => {
    const wrapper = mount(LumeOverlayGroup, {
      propsData: {
        ...defaultPropsData,
      },
    });

    wrapper.findAll('rect').at(0).trigger('mouseover');
    wrapper.findAll('rect').at(3).trigger('mouseover');

    const mouseoverEvent = wrapper.emitted('mouseover');

    expect(mouseoverEvent[0]).toEqual([0]); // first trigger
    expect(mouseoverEvent[1]).toEqual([3]); // second trigger
  });
});
