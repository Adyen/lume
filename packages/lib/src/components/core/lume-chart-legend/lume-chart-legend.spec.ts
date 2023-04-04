import { mount } from '@vue/test-utils';

import LumeLegend from './lume-chart-legend.vue';

import { generateData } from '@test/unit/mock-data';

describe('lume-chart-legend.vue', () => {
  test('mounts component', () => {
    const numberOfSets = 3;
    const data = generateData(numberOfSets, 7, 1000, false, false, true);
    const wrapper = mount(LumeLegend, { props: { data } });

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.findAll('[data-j-chart-legend__symbol]')).toHaveLength(
      numberOfSets
    );
  });

  test('validation fails when color is not specified', () => {
    const data = generateData(1, 7, 1000, false, false, false);

    expect((LumeLegend as any).props.data.validator(data)).toBe(false);
  });

  describe('Events API', () => {
    it('should dispatch `click` if user clicks a legend item', async () => {
      const data = generateData(3, 7, 1000, false, false, true);
      const wrapper = mount(LumeLegend, { props: { data } });

      const items = wrapper.findAll('[data-j-chart-legend__symbol-wrapper=""]');

      await items[0].trigger('click');
      await items[2].trigger('click');

      expect(wrapper.emitted()).toHaveProperty('click');
      expect(wrapper.emitted().click).toHaveLength(2);

      const eventPayload = wrapper.emitted().click[0][0];

      expect(eventPayload).toHaveProperty('index');
      expect(eventPayload).toHaveProperty('dataset');
      expect(eventPayload).toHaveProperty('event');
    });

    it('should dispatch `mouseenter` if user mouses over a legend item', async () => {
      const data = generateData(3, 7, 1000, false, false, true);
      const wrapper = mount(LumeLegend, { props: { data } });

      const items = wrapper.findAll('[data-j-chart-legend__symbol-wrapper=""]');

      await items[0].trigger('mouseenter');
      await items[2].trigger('mouseenter');

      expect(wrapper.emitted()).toHaveProperty('mouseenter');
      expect(wrapper.emitted().mouseenter).toHaveLength(2);

      const eventPayload = wrapper.emitted().mouseenter[0][0];

      expect(eventPayload).toHaveProperty('index');
      expect(eventPayload).toHaveProperty('dataset');
      expect(eventPayload).toHaveProperty('event');
    });

    it('should dispatch `mouseleave` if user mouses away from the legend', async () => {
      const data = generateData(3, 7, 1000, false, false, true);
      const wrapper = mount(LumeLegend, { props: { data } });

      await wrapper.trigger('mouseleave');

      expect(wrapper.emitted()).toHaveProperty('mouseleave');
      expect(wrapper.emitted().mouseleave).toHaveLength(1);
    });
  });
});
