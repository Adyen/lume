import { mount } from '@vue/test-utils';
import AdvBarGroup, { BarConfig } from '@/core/adv-bar-group.vue';

const width = 100;
const height = 100;
const fillClass = 'my-class';

const bars: BarConfig<any> = [
    {
        x: 0,
        y: 0,
        width,
        height,
        fillClass
    }
];

describe('bar-group.vue', () => {
    test('mounts component', () => {
        const wrapper = mount(AdvBarGroup, {
            propsData: {
                bars
            }
        })

        const el = wrapper.find('[data-j-bar]');
        expect(el.exists()).toBeTruthy()
    });
});