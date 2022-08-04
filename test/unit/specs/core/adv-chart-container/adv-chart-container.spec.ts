import { mount } from '@vue/test-utils';
import Container from '@/core/adv-chart-container';

const containerSize = { width: 640, height: 480 };

describe('chart-container.vue', () => {
    test('mounts component', () => {
        const wrapper = mount(Container, { propsData: { containerSize } })

        const el = wrapper.find('[data-j-chart-container]');
        expect(el.exists()).toBeTruthy();
    })

    test('mounts component and set custom margin values', () => {
        const margins = {
            top: 10,
            left: 14,
        };

        const wrapper = mount(Container, {
            propsData: { margins, containerSize }
        })

        const el = wrapper.find('[data-j-chart-container__group]');
        expect(el.attributes()['transform']).toEqual(`translate(${margins.left}, ${margins.top})`);
    })
})