import { mount } from '@vue/test-utils';
import Bar from '@/core/bar/bar.vue';

const width = 100;
const height = 100;
const fillClass = 'my-class';
const animateClass = 'bar--transition';
const fadeClass = 'bar--faded';

const defaultProps = {
    width,
    height,
    fillClass
}

describe('Bar.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(Bar, {
            propsData: defaultProps
        })

        const el = wrapper.find('[data-j-bar]');
        expect(el.exists()).toBeTruthy()
        expect(el.attributes()['width']).toEqual(width.toString());
        expect(el.attributes()['height']).toEqual(width.toString());
        expect(el.attributes()['x']).toEqual('0');
        expect(el.attributes()['y']).toEqual('0');
        expect(el.classes().includes(fillClass)).toBeTruthy();
        expect(el.classes().includes(animateClass)).toBeTruthy();
        expect(el.classes().includes(fadeClass)).toBeFalsy();
    });

    test('mounts component and sets custom x and y prop values', () => {
        const x = 48;
        const y = 52;

        const wrapper = mount(Bar, {
            propsData: { ...defaultProps, x, y }
        });

        const el = wrapper.find('[data-j-bar]');
        expect(el.attributes()['x']).toEqual(x.toString());
        expect(el.attributes()['y']).toEqual(y.toString());
    })

    test('mounts component and sets custom isFaded and animate prop values', () => {
        const wrapper = mount(Bar, {
            propsData: { ...defaultProps, isFaded: true, animate: false }
        });

        const el = wrapper.find('[data-j-bar]');
        expect(el.classes().includes(animateClass)).toBeFalsy();
        expect(el.classes().includes(fadeClass)).toBeTruthy();
    })
});
