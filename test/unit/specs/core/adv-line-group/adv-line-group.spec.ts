import AdvCharLineGroup from '@/core/adv-line-group';
import { mount } from "@vue/test-utils";
import { ref, Ref } from "@vue/composition-api";
import { ContainerSize } from "@/types/size";
import { getXByIndex, Scale } from "@/mixins/scales";
import { scaleBand, scaleLinear } from "d3-scale";
import { Data, DatasetValueObject } from '@/types/dataset';
import Vue from 'vue';

const width: number = 640;
const height: number = 480;
const labels: Ref<Array<string>> = ref(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
// const size: ContainerSize  = { width, height: 480 };
const data: Data<DatasetValueObject<number>> = [
    { values: [
            { value: 10 },
            { value: 40 },
            { value: 30 },
            { value: 20 },
            { value: 70 },
            { value: 60 },
            { value: 50 },
        ] },
];
const highestValue = Math.max(...data[0].values.map(({ value }) => value));
const xScale: Scale = scaleBand<number>()
    .domain(labels.value.map((_, i) => i))
    .range([0, width]);
const yScale: Scale = scaleLinear<number>()
    .domain([0, highestValue])
    .range([0, height])
const defaultPropsData = { data, xScale, yScale };

describe('adv-line-group.vue', () => {
    test('mounts component and sets prop values', () => {
        const wrapper = mount(AdvCharLineGroup, {
            propsData: defaultPropsData
        })

        const el = wrapper.find('[data-j-adv-line-group]');
        expect(el.exists()).toBeTruthy()
        expect(el.find('[data-j-adv-line-group__points]').exists()).toBeTruthy();
        expect(el.attributes()['d']).toBeFalsy()
        expect(true).toBe(true)
    })

    test('mounts and creates path if hoveredIndex is set', () => {
        const hoveredIndex = 1;
        const peak = data[0].values[hoveredIndex].value;
        const x = getXByIndex(xScale, hoveredIndex);
        const d = `M ${x},${yScale.range()[1]}
            V ${yScale(peak)}`;

        const wrapper = mount(AdvCharLineGroup, {
            propsData: {
                ...defaultPropsData,
                hoveredIndex
            }
        })

        const el = wrapper.find('[data-j-adv-line-group__overlay-line]');
        expect(el.attributes()['d']).toEqual(d)
    })

    test('mounts without points', () => {
        const wrapper = mount(AdvCharLineGroup, {
            propsData: {
                ...defaultPropsData,
                withPoints: false
            }
        })

        const el = wrapper.find('[data-j-adv-line-group__points]');
        expect(el.exists()).toBeFalsy();
    });

    test('mounts with custom mouse over function', async () => {
        const onMouseoverFn = jest.fn();
        const param = 1;
        const wrapper = mount(AdvCharLineGroup, {
            propsData: {
                ...defaultPropsData,
                onMouseoverFn
            }
        })

        const el = wrapper.find(`[data-j-adv-line-group__overlay-bar="${param}"]`);
        el.trigger('mouseover');
        await Vue.nextTick();
        expect(onMouseoverFn).toHaveBeenCalledWith(param);
    })
})
