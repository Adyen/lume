import { mount } from '@vue/test-utils';
import AdvAxis from '@/core/adv-axis/adv-axis.vue';
import { Scale } from '@/mixins/scales';
import { scaleBand } from 'd3-scale';
import { labels } from '../../mock-data';

const width = 640;
const scale: Scale = scaleBand<number>()
    .domain(labels.map((_, i) => i))
    .range([0, width]);

describe('adv-axis.vue', () => {
    test('mounts component and sets prop values',() => {
        const wrapper = mount(AdvAxis, {
            propsData: {
                scale
            }
        })

        const el = wrapper.find('[data-j-axis]');
        expect(el.exists()).toBeTruthy()
        expect(wrapper.emitted('tick-mouseover')).toBeFalsy();
    });

    test('should emit event on mouseover on data-j-axis__tick-label', () => {
        const wrapper = mount(AdvAxis, {
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