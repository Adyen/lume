import { mount } from '@vue/test-utils';
import { data, labels, xScale, yScale } from '../../mock-data';
import StackedBarChart from '@/charts/adv-stacked-bar-chart/adv-stacked-bar-chart.vue';
import { Orientation } from '@/constants';

const orientation: Orientation = 'horizontal';

describe('adv-stacked-bar-chart.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(StackedBarChart, {
            propsData: { data, labels, xScale, yScale }
        });

        const el = wrapper.find('[data-j-stacked-bar-chart]')
        expect(el.exists()).toBeTruthy();
        expect(el.find('[data-j-bars-group]').exists()).toBeTruthy();
        const barsGroupComponent = el.find('[data-j-bars-group]');
        expect(barsGroupComponent.props()['orientation']).toEqual('vertical');
    });

    test('mounts component and sets custom orientation', () => {
        const wrapper = mount(StackedBarChart, {
            propsData: { data, labels, xScale, yScale, orientation }
        });

        const el = wrapper.find('[data-j-bars-group]')
        expect(el.props()['orientation']).toEqual('horizontal');
    });
})
