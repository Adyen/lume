import { shallowMount} from '@vue/test-utils';
import { data } from '../../mock-data';
import BarChart from '@/charts/adv-bar-chart/adv-bar-chart.vue';

describe.skip('bar.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = shallowMount(BarChart, {
            propsData: { data }
        });

        expect(wrapper.find('[data-j-adv-bar-chart]')).toBeTruthy();
    });
});
