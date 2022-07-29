import { mount } from '@vue/test-utils';
import AdvBarGroup from '@/core/adv-bar-group/adv-bar-group.vue';
import { data, xScale, yScale } from '../../mock-data';

const width = 100;
const height = 100;
const fillClass = 'my-class';

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
    });
});
