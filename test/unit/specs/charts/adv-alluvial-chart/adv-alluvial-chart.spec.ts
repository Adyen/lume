import { mount } from '@vue/test-utils';
import AdvAlluvialChart from '@/charts/adv-alluvial-chart/adv-alluvial-chart.vue';
import DATASETS from '@/docs/storybook-data/alluvial-data';

describe('adv-alluvial-chart.vue', () => {
    test('mounts component and sets prop values', async () => {
        const wrapper = mount(AdvAlluvialChart, {
            propsData: { data: DATASETS.Basic.data }
        });

        const el = wrapper.find('[data-j-alluvial-chart]');
        expect(el.exists()).toBeTruthy();
        expect(el.find('[data-j-alluvial-group]').exists()).toBeTruthy();
        expect(el.find('[data-j-alluvial-group__ghost-path]').exists()).toBeTruthy();
        expect(el.find('[data-j-alluvial-group__path]').exists()).toBeTruthy();
        expect(el.find('[data-j-alluvial-group__node-block]').exists()).toBeFalsy();
    });
});