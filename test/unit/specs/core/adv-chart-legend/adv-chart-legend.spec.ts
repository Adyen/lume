import { mount } from '@vue/test-utils';
import AdvLegend from '@/core/adv-chart-legend';
import { generateData } from '../../mock-data';

describe('adv-chart-legend.vue', () => {
  test('mounts component', () => {
    const numberOfSets = 3;
    const data = generateData(numberOfSets, 7, 1000, false, false, true);
    const wrapper = mount(AdvLegend, {
      propsData: { data },
    });

    expect(wrapper.exists()).toBeTruthy();
    expect(wrapper.findAll('[data-j-chart-legend__circle]')).toHaveLength(
      numberOfSets
    );
    expect(
      wrapper
        .find('[data-j-chart-legend__circle]')
        .classes()
        .includes('adv-background-color--01')
    ).toBe(true);
    expect(
      wrapper
        .findAll('[data-j-chart-legend__circle]')
        .at(1)
        .classes()
        .includes('adv-background-color--02')
    ).toBe(true);
    expect((AdvLegend as any).props.data.validator(data)).toBe(true);
  });

  test('validation fails when color is not specified', () => {
    const data = generateData(1, 7, 1000, false, false, false);

    expect((AdvLegend as any).props.data.validator(data)).toBe(false);
  });
});
