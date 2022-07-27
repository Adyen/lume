import { mount } from '@vue/test-utils';
import AdvBarGroup from '@/core/adv-bar-group.vue';

const width = 100;
const height = 100;
const fillClass = 'my-class';

// Note that this should be of the BarConfig interface type in bars-group.vue, but ts-jest can't import it
const bars: Array<any> = [
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

        const el = wrapper.find('[data-j-bars-group]');
        expect(el.exists()).toBeTruthy()
        expect(el.find('[data-j-bars-group__bar]').attributes()['animate']).toBeFalsy();
        expect(el.find('[data-j-bars-group__overlay]').exists()).toBeFalsy();
    });

    test('mounts component and sets animate to true', () => {
        const wrapper = mount(AdvBarGroup, {
            propsData: {
                bars,
                animate: true
            }
        })

        const el = wrapper.find('[data-j-bars-group__bar]');
        expect(el.attributes()['animate']).toBeFalsy();
    });

    test('mounts component and sets custom overlay object', () => {
        const x = 123;
        const wrapper = mount(AdvBarGroup, {
            propsData: {
                bars,
                animate: true,
                overlay: { width: 0, height: 0, x, y: 0 }
            }
        })

        const el = wrapper.find('[data-j-bars-group__overlay]');
        expect(el.exists()).toBeTruthy();
        expect(el.attributes()['x']).toEqual(x.toString());
    });
});
