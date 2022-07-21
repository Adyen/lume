import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import { mount } from '@vue/test-utils';
import { Ref, ref } from '@vue/composition-api';
import Axis from '@/core/axis/adv-axis.vue';
import { Data, DatasetValueObject } from '@/types/dataset';
import { Scale } from '@/mixins/scales';
import { scaleBand } from 'd3-scale';
import { ContainerSize } from '@/types/size';

Vue.use(VueCompositionAPI);

const width: number = 640;
const data: Ref<Data<DatasetValueObject<number>>> = ref([
    { values: [
        { value: 10 },
        { value: 40 },
        { value: 30 },
        { value: 20 },
        { value: 70 },
        { value: 60 },
        { value: 50 },
    ] },
]);

const labels: Ref<Array<string>> = ref(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const size: ContainerSize  = { width, height: 480 };
const scale: Scale = scaleBand<number>()
    .domain(labels.value.map((_, i) => i))
    .range([0, width])

describe('adv-axis.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(Axis, {
            propsData: {
                scale
            }
        })

        const el = wrapper.find('[data-j-axis]');
        expect(el.exists()).toBeTruthy()
        expect(true).toBe(true)
    })
})