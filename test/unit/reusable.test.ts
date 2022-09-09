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
    
  const firstDataSet = generateData(firstNumberOfSets, firstNumberOfRecords);
  const secondDataSet = generateData(secondNumberOfSets, secondNumberOfRecords);
  const emptyDataSet = generateData(1, 0);

  const wrapper = mount(component, {
    // Note that we need to flip the scales so as to feed band and linear scales correctly
    propsData: { data: [{ values: [] }], labels, yScale, xScale }
  });

  const cases = [
    { dataset: firstDataSet, expectedResult: firstNumberOfSets * firstNumberOfRecords },
    { dataset: emptyDataSet, expectedResult: 0 },
    { dataset: secondDataSet, expectedResult: secondNumberOfSets * secondNumberOfRecords },
  ];

  test.each(cases)('mounts component and updates dataset', async ({ dataset, expectedResult }) => {              
    await wrapper.setProps({ data: dataset });
    expect(wrapper.findAll(targetIdentifier)).toHaveLength(expectedResult);
  });
}
