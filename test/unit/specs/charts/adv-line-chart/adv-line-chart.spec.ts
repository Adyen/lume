import { mount } from '@vue/test-utils';
import { data, labels, xScale, yScale } from '../../mock-data';
import AdvLineChart from '@/charts/adv-line-chart/adv-line-chart.vue';

const numberOfLines = data[0].values.length;

describe('adv-line-chart.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(AdvLineChart, {
            propsData: { data, labels, xScale, yScale }
        });

        const el = wrapper.find('[data-j-adv-line-chart]')
        expect(el.exists()).toBeTruthy();
        expect(el.find('[data-j-adv-line-group]').exists()).toBeTruthy();
        expect(el.findAll('[data-j-line]')).toHaveLength(numberOfLines);
    });

    test('mounts component and sets prop with two datasets', () => {
        const manipulatedData = JSON.parse(JSON.stringify(data));
        manipulatedData.push(JSON.parse(JSON.stringify(data[0])));
        const wrapper = mount(AdvLineChart, {
            propsData: { data: manipulatedData, labels, xScale, yScale }
        });

        const elements = wrapper.findAll('[data-j-line]');
        expect(elements).toHaveLength(2 * numberOfLines);
    });
});
