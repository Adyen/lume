import { mount } from '@vue/test-utils';
import Axis from '@/core/axis/adv-axis.vue';
import { Scale } from '@/mixins/scales';
import { scaleBand } from 'd3-scale';
import { labels } from '../../mock-data';

const width = 640;
const scale: Scale = scaleBand<number>()
    .domain(labels.map((_, i) => i))
    .range([0, width])

describe.skip('adv-axis.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(Axis, {
            propsData: {
                scale
            }
        })

        const el = wrapper.find('[data-j-axis]');
        expect(el.exists()).toBeTruthy()
    })
})