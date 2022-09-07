import { generateData, labels, xScale, yScale } from "./specs/mock-data";
import { mount } from "@vue/test-utils";

const defaultFirstNumberOfSets = 3;
const defaultFirstNumberOfRecords = 7;
const defaultSecondNumberOfSets = 4;
const defaultSecondNumberOfRecords = 5;

export const testDynamicBehaviour = (
    component,
    targetIdentifier,
    firstNumberOfSets = defaultFirstNumberOfSets,
    firstNumberOfRecords = defaultFirstNumberOfRecords,
    secondNumberOfSets = defaultSecondNumberOfSets,
    secondNumberOfRecords = defaultSecondNumberOfRecords
) => {
    test('mounts component and updates dataset', async () => {
        const firstDataSet = generateData(firstNumberOfSets, firstNumberOfRecords);
        const secondDataSet = generateData(secondNumberOfSets, secondNumberOfRecords);

        const wrapper = mount(component, {
            // Note that we need to flip the scales so as to feed band and linear scales correctly
            propsData: { data: firstDataSet, labels, yScale, xScale }
        });

        expect(wrapper.findAll(targetIdentifier)).toHaveLength(firstNumberOfSets * firstNumberOfRecords);
        await wrapper.setProps({ data: secondDataSet });
        expect(wrapper.findAll(targetIdentifier)).toHaveLength(secondNumberOfSets * secondNumberOfRecords);
        await wrapper.setProps({ data: [{ values: [] }] });
        expect(wrapper.findAll(targetIdentifier)).toHaveLength(0);
        await wrapper.setProps({ data: secondDataSet });
        expect(wrapper.findAll(targetIdentifier)).toHaveLength(secondNumberOfSets * secondNumberOfRecords);
    });
}
