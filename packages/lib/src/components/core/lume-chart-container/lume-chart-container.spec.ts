import { mount } from '@vue/test-utils';

import LumeChartContainer from './lume-chart-container.vue';

import {
  useCustomBoundingRectClient,
  useCustomResizeObserver,
} from '@test/unit/reusable.test';

const defaultMargins = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

describe('chart-container.vue', () => {
  useCustomResizeObserver();
  useCustomBoundingRectClient();

  test('mounts component', () => {
    const wrapper = mount(LumeChartContainer, {
      props: { margins: defaultMargins },
    });

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
      props: { margins },
    });

    const el = wrapper.find('[data-j-chart-container__group]');
    expect(el.attributes()['transform']).toEqual(
      `translate(${margins.left}, ${margins.top})`
    );
  });

  describe('Events API', () => {
    it('should dispatch `click` if user clicks the <svg> container', async () => {
      const wrapper = mount(LumeChartContainer, {
        props: { margins: defaultMargins },
      });

      const svgContainer = wrapper.find('[data-j-chart-container__root=""]');

      await svgContainer.trigger('click');

      expect(wrapper.emitted()).toHaveProperty('click');
      expect(wrapper.emitted().click).toHaveLength(1);
    });

    it('should dispatch `mouseenter` if user mouses over the <svg> container', async () => {
      const wrapper = mount(LumeChartContainer, {
        props: { margins: defaultMargins },
      });

      const svgContainer = wrapper.find('[data-j-chart-container__root=""]');

      await svgContainer.trigger('mouseenter');

      expect(wrapper.emitted()).toHaveProperty('mouseenter');
      expect(wrapper.emitted().mouseenter).toHaveLength(1);
    });

    it('should dispatch `mouseleave` if user moves mouse away from the <svg> container', async () => {
      const wrapper = mount(LumeChartContainer, {
        props: { margins: defaultMargins },
      });

      const svgContainer = wrapper.find('[data-j-chart-container__root=""]');

      await svgContainer.trigger('mouseleave');

      expect(wrapper.emitted()).toHaveProperty('mouseleave');
      expect(wrapper.emitted().mouseleave).toHaveLength(1);
    });

    it('should dispatch `resize` if <svg> container changes dimensions', async () => {
      const wrapper = mount(LumeChartContainer, {
        props: { margins: defaultMargins },
      });

      await wrapper.trigger('resize');

      expect(wrapper.emitted()).toHaveProperty('resize');
      expect(wrapper.emitted().resize).toHaveLength(1);
    });
  });
});
