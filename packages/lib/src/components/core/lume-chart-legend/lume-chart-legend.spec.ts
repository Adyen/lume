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

  test('should emit click event with clicked index on clicking a legend item', async () => {
    const numberOfSets = 3;
    const data = generateData(numberOfSets, 7, 1000, false, false, true);
    const wrapper = mount(LumeLegend, { props: { data } });

    const target = wrapper.findAll('[data-j-chart-legend__symbol-wrapper]');
    target[0].trigger('click');
    target[2].trigger('click');

    await wrapper.vm.$nextTick();

    const mouseoverEvent = wrapper.emitted('click');

    expect(mouseoverEvent[0]).toEqual([0]); // first trigger
    expect(mouseoverEvent[1]).toEqual([2]); // second trigger
  });
});
