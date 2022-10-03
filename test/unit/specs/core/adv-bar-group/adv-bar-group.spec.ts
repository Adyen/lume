import { mount } from '@vue/test-utils';
import AdvBarGroup from '@/groups/adv-bar-group/adv-bar-group.vue';
import { data, xScale, yScale } from '../../mock-data';
import { Orientation } from '@/constants';

const orientation: Orientation = 'horizontal';

describe('bar-group.vue', () => {
  test('mounts component', () => {
    const wrapper = mount(AdvBarGroup, {
      propsData: {
        data,
        xScale,
        yScale
      }
    })

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.exists()).toBeTruthy()
    expect(wrapper.find('[data-j-adv-bar]').attributes('x')).not.toEqual('0');
    expect(wrapper.find('[data-j-adv-bar]').attributes()['class'].includes('adv-fill--skyblue')).toBe(true);
  });

  test('mounts component with horizontal orientation', () => {
    const wrapper = mount(AdvBarGroup, {
      propsData: {
        data,
        xScale: yScale,
        yScale: xScale,
        orientation
      }
    })

    const el = wrapper.find('[data-j-bars-group]');
    expect(el.exists()).toBeTruthy()
    expect(wrapper.find('[data-j-adv-bar]').attributes('x')).toEqual('0');
  })
});
