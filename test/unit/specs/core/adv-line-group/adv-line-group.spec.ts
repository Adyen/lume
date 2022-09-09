import AdvCharLineGroup from '@/groups/adv-line-group';
import { mount } from '@vue/test-utils';
import { getXByIndex } from '@/mixins/scales';
import { data, xScale, yScale } from '../../mock-data';

const defaultPropsData = { data, xScale, yScale };

describe('adv-line-group.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(AdvCharLineGroup, {
      propsData: defaultPropsData,
    });

    const el = wrapper.find('[data-j-adv-line-group]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-adv-line-group__points]').exists()).toBeTruthy();
    expect(el.attributes()['d']).toBeFalsy();
    expect(true).toBe(true);
  });

  test('mounts and creates path if hoveredIndex is set', () => {
    const hoveredIndex = 1;
    const peak = data[0].values[hoveredIndex].value;
    const x = getXByIndex(xScale, hoveredIndex);
    const d = `M ${x},${yScale.range()[1]}
            V ${yScale(peak)}`;

    const wrapper = mount(AdvCharLineGroup, {
      propsData: {
        ...defaultPropsData,
        hoveredIndex,
      },
    });

    const el = wrapper.find('[data-j-adv-line-group__overlay-line]');
    expect(el.attributes()['d']).toEqual(d);
  });

  test('mounts without points', () => {
    const wrapper = mount(AdvCharLineGroup, {
      propsData: {
        ...defaultPropsData,
        withPoints: false,
      },
    });

    const el = wrapper.find('[data-j-adv-line-group__points]');
    expect(el.exists()).toBeFalsy();
  });
});
