import { mount } from '@vue/test-utils';

import LumeOverlayGroup from './lume-overlay-group.vue';

import { data, xScale, yScale } from '@test/unit/mock-data';

const defaultprops = { data, xScale, yScale };

describe('lume-line-group.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeOverlayGroup, {
      props: defaultprops,
    });

    const el = wrapper.find('[data-j-lume-overlay-group]');
    expect(el.exists()).toBeTruthy();
  });

  test('emits mouseover event with hovered index', () => {
    const wrapper = mount(LumeOverlayGroup, {
      props: {
        ...defaultprops,
      },
    });

    wrapper.findAll('rect')[0].trigger('mouseover');
    wrapper.findAll('rect')[3].trigger('mouseover');

    const mouseoverEvent = wrapper.emitted('mouseover');

    expect(mouseoverEvent[0]).toEqual([0]); // first trigger
    expect(mouseoverEvent[1]).toEqual([3]); // second trigger
  });
});
