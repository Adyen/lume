import { mount } from '@vue/test-utils';

import LumeBarGroup from './lume-bar-group.vue';

import { data, xScale, yScale } from '@test/unit/mock-data';

import { Orientation } from '@/utils/constants';

const orientation: Orientation = 'horizontal';

describe('bar-group.vue', () => {
  test('mounts component', () => {
    const wrapper = mount(LumeBarGroup, {
      props: {
        data,
        xScale,
        yScale,
      },
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
});
