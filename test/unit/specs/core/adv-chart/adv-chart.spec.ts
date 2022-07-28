import { mount } from '@vue/test-utils';
import AdvChart from '@/core/adv-chart/adv-chart.vue';
import { data, labels } from '../../mock-data';

describe('adv-chart.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(AdvChart, {
            propsData: {
                data,
                // NOTE: If labels are not specified here, an error occurs, even thought labels is marked as an optional property
                labels,
            }
        })

        const el = wrapper.find('[data-j-adv-chart]');
        expect(el.exists()).toBeTruthy()
        expect(el.find('[data-j-adv-chart__tooltip]').exists()).toBeTruthy()
        // expect(el.find('[data-j-adv-chart__axes]').exists()).toBeTruthy()
    })

    test('mounts component with tooltip disabled', () => {
        const wrapper = mount(AdvChart, {
            propsData: {
                data,
                labels,
                options: {
                    withTooltip: false
                }
            }
        })

        const el = wrapper.find('[data-j-adv-chart__tooltip]');
        expect(el.exists()).toBeFalsy()
    });

    // In order for this to work, we would have to alter the structure of the component that is being tested
    // We should find another way to assert this.
    test.skip('mounts component with axes disabled', () => {
        const wrapper = mount(AdvChart, {
            propsData: {
                data,
                labels,
                options: {
                    showAxes: false
                }
            }
        })

        const el = wrapper.find('[data-j-adv-chart__axes]');
        expect(el.exists()).toBeFalsy()
    });

    test('mounts component with negative values', () => {
        const wrapper = mount(AdvChart, {
            propsData: {
                data: [{ values: data[0].values.map(({ value }) => ({ value: -1 * value })) }],
                labels,
            }
        })

        const el = wrapper.find('[data-j-adv-chart__negative-values]');
        expect(el.exists()).toBeTruthy();
    });
});