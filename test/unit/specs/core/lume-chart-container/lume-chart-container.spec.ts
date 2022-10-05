import { mount } from '@vue/test-utils';
import LumeChartContainer from '@/components/core/lume-chart-container';
import {
  useCustomBoundingRectClient,
  useCustomResizeObserver,
} from '../../../reusable.test';
import Vue from 'vue';

describe('chart-container.vue', () => {
  useCustomResizeObserver();
  useCustomBoundingRectClient();

  test('mounts component', () => {
    const wrapper = mount(LumeChartContainer);

    const el = wrapper.find('[data-j-chart-container]');
    expect(el.exists()).toBeTruthy();
    expect(wrapper.emitted('mouseleave')).toBeFalsy();
    expect(wrapper.emitted('resize')).toBeFalsy();
  });

  test('mounts component and set custom margin values', () => {
    const margins = {
      top: 10,
      left: 14,
    };

    const wrapper = mount(LumeChartContainer, {
      propsData: { margins },
    });

    const el = wrapper.find('[data-j-chart-container__group]');
    expect(el.attributes()['transform']).toEqual(
      `translate(${margins.left}, ${margins.top})`
    );
  });

  test('should emit on mouseleave on root', () => {
    const wrapper = mount(LumeChartContainer);

    const el = wrapper.find('[data-j-chart-container__root]');
    el.trigger('mouseleave');
    expect(wrapper.emitted('mouseleave')).toBeTruthy();
  });

  test('should emit "resize" on new dimensions', async () => {
    const wrapper = mount(LumeChartContainer);

    wrapper.find('[data-j-chart-container]').trigger('resize');
    await Vue.nextTick();
    expect(wrapper.emitted('resize')).toBeTruthy();
  });
});
