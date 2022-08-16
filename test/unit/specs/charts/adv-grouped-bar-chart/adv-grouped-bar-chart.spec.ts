import { mount } from '@vue/test-utils';
import { data, labels, xScale, yScale, generateData } from '../../mock-data';
import GroupedBarChart from '@/charts/adv-grouped-bar-chart/adv-grouped-bar-chart.vue';
import { Orientation } from '@/constants';

const orientation: Orientation = 'horizontal';
const numberOfBars = data[0].values.length;

describe('adv-grouped-bar-chart.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(GroupedBarChart, {
            propsData: { data, labels, xScale, yScale }
        });

        const el = wrapper.find('[data-j-grouped-bar-chart]')
        expect(el.exists()).toBeTruthy();
        expect(el.find('[data-j-bars-group]').exists()).toBeTruthy();
        const barsGroupComponent = el.find('[data-j-bars-group]');
        expect(barsGroupComponent.props()['orientation']).toEqual('vertical');
        expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfBars);
    });

    test('mounts component and sets custom orientation', () => {
        const wrapper = mount(GroupedBarChart, {
            // Note that we need to flip the scales so as to feed band and linear scales correctly
            propsData: { data, labels, yScale: xScale, xScale: yScale, orientation }
        });

        const el = wrapper.find('[data-j-bars-group]');
        expect(el.props()['orientation']).toEqual('horizontal');
        expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfBars);
    });

    test('mounts component with double dataset', () => {
        const numberOfSets = 2;
        const manipulatedData = generateData(numberOfSets, data[0].values.length)
        const wrapper = mount(GroupedBarChart, {
            // Note that we need to flip the scales so as to feed band and linear scales correctly
            propsData: { data: manipulatedData, labels, yScale: xScale, xScale: yScale, orientation }
        });

        const el = wrapper.find('[data-j-bars-group]');
        expect(el.findAll('[data-j-adv-bar]')).toHaveLength(numberOfSets * numberOfBars);
    })
});
