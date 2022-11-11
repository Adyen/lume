import { mount } from '@vue/test-utils';

import LumeLegend from './lume-chart-legend.vue';

import { generateData } from '@test/unit/mock-data';

describe('lume-chart-legend.vue', () => {
  test('mounts component', () => {
    const numberOfSets = 3;
    const data = generateData(numberOfSets, 7, 1000, false, false, true);
    const wrapper = mount(LumeLegend, {
      propsData: { data },
    });

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.findAll('[data-j-chart-legend__symbol]')).toHaveLength(
      numberOfSets
    );
    expect(
      wrapper
        .find('[data-j-chart-legend__symbol]')
        .classes()
        .includes('lume-background-color--01')
    ).toBe(true);
    expect(
      wrapper
        .findAll('[data-j-chart-legend__symbol]')
        .at(1)
        .classes()
        .includes('lume-background-color--02')
    ).toBe(true);
    expect((LumeLegend as any).props.data.validator(data)).toBe(true);
  });

  test('validation fails when color is not specified', () => {
    const data = generateData(1, 7, 1000, false, false, false);

    expect((LumeLegend as any).props.data.validator(data)).toBe(false);
  });

  test('should emit click event with clicked index on clicking a legend item', async () => {
    const numberOfSets = 3;
    const data = generateData(numberOfSets, 7, 1000, false, false, true);
    const wrapper = mount(LumeLegend, {
      propsData: { data },
    });

    const target = wrapper.findAll('[data-j-chart-legend__symbol-wrapper]');
    target.at(0).trigger('click');
    target.at(2).trigger('click');

    await wrapper.vm.$nextTick();

    const mouseoverEvent = wrapper.emitted('click');

    expect(mouseoverEvent[0]).toEqual([0]); // first trigger
    expect(mouseoverEvent[1]).toEqual([2]); // second trigger
  });
});
