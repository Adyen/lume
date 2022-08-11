import { mount } from '@vue/test-utils';
import { data, labels } from '../../mock-data';
import AdvSparkline from '@/charts/adv-sparkline-chart/adv-sparkline.vue';

describe('adv-single-bar-chart.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(AdvSparkline, {
            propsData: { data, labels }
        });

        const el = wrapper.find('[data-j-sparkline]')
        const props = wrapper.vm.$props;
        expect(el.exists()).toBeTruthy();
        expect(props).toHaveProperty('data');
        expect(props.data).toEqual(data);
        expect(props).toHaveProperty('labels');
        expect(props.labels).toEqual(labels);
        expect(props).toHaveProperty('options');
        expect(props.options).toEqual({});
        expect(el.find('[data-j-sparkline__path]').classes().includes(`sparkline-chart__area--color-01`)).toBe(true);
    });

    test('mounts component and sets custom area color', () => {
        const areaColor = '02';
        const mutatedData = JSON.parse(JSON.stringify(data));
        mutatedData[0].areaColor = areaColor;

        const wrapper = mount(AdvSparkline, {
            propsData: { data: mutatedData, labels }
        });

        const el = wrapper.find('[data-j-sparkline]')
        expect(el.find('[data-j-sparkline__path]').classes().includes(`sparkline-chart__area--color-${areaColor}`)).toBe(true);
    })
})
