import { mount } from '@vue/test-utils';
import LumeAxis from '../../../../../src/core/lume-axis/lume-axis.vue';
import { Scale } from '@/composables/scales';
import { scaleBand } from 'd3-scale';
import { labels } from '../../mock-data';

const width = 640;
const scale: Scale = scaleBand<number>()
  .domain(labels.map((_, i) => i))
  .range([0, width]);

describe('lume-axis.vue', () => {
  test('mounts component and sets prop values',async () => {
    const wrapper = await mount(LumeAxis, {
      propsData: {
        scale,
      }
    })

    const el = wrapper.find('[data-j-axis]');
    expect(el.exists()).toBeTruthy();
    const ticks = wrapper.findAll('[data-j-axis__tick]')
    expect(el.exists()).toBeTruthy();
    expect(ticks).toHaveLength(7);
    expect(wrapper.emitted('tick-mouseover')).toBeFalsy();
  });

  test('mounts component and sets custom value for skip option to false',async () => {
    const wrapper = await mount(LumeAxis, {
      propsData: {
        scale,
        options: { skip: false }
      }
    })

    expect(
      wrapper
        .findAll('[data-j-axis__tick]')
        .filter(record => record.classes().includes('axis__tick--hidden'))
    ).toHaveLength(0);
  });

  test('mounts component and sets custom value for skip option to 2',async () => {
    const skip = 2;
    const wrapper = await mount(LumeAxis, {
      propsData: {
        scale,
        options: { skip }
      }
    })

    expect(
      wrapper
        .findAll('[data-j-axis__tick]')
        .filter(record => record.classes().includes('axis__tick--hidden'))
    ).toHaveLength(Math.ceil(labels.length / skip));
  });

  test('should emit event on mouseover on data-j-axis__tick-label', () => {
    const wrapper = mount(LumeAxis, {
      propsData: {
        scale
      }
    })

    const el = wrapper.findAll('[data-j-axis__tick-label]');
    el.at(0).trigger('mouseover');
    el.at(3).trigger('mouseover');

    const mouseoverEvent = wrapper.emitted('tick-mouseover');

    expect(mouseoverEvent[0]).toEqual([0]); // first trigger
    expect(mouseoverEvent[1]).toEqual([3]); // second trigger
  })
});