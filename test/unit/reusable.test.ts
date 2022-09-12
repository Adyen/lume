import { mount, Wrapper } from "@vue/test-utils";
import { AdvChart } from "@/core";
import { generateData } from "./specs/mock-data";
import { VueConstructor } from "vue";

const defaultFirstNumberOfSets = 3;
const defaultFirstNumberOfRecords = 7;
const defaultSecondNumberOfSets = 4;
const defaultSecondNumberOfRecords = 5;

type ComponentInstance = VueConstructor;
type PropsData = Record<string, unknown>;
type WrapperInstance = Wrapper<InstanceType<typeof AdvChart>>;
export class BaseTestSuite {
  public component: ComponentInstance = null; 
  public propsData: PropsData = null;
  public wrapper: WrapperInstance = null;

  constructor(component: ComponentInstance, propsData: PropsData) {
    this.component = component;
    this.propsData = propsData;
    this.mount();
  }

  public mount() {
    this.wrapper = mount(this.component, {
      propsData: {
        ...(this.propsData && this.propsData)
      }
    });
  }

  public run() {
    this.snapShotTest();
  }

  public snapShotTest() {
    expect(this.wrapper.element).toMatchSnapshot();
  }

  public multiDataSetTest(
    targetIdentifier,
    firstNumberOfSets = defaultFirstNumberOfSets,
    firstNumberOfRecords = defaultFirstNumberOfRecords,
    secondNumberOfSets = defaultSecondNumberOfSets,
    secondNumberOfRecords = defaultSecondNumberOfRecords
  ) {
    const firstDataSet = generateData(firstNumberOfSets, firstNumberOfRecords);
    const secondDataSet = generateData(secondNumberOfSets, secondNumberOfRecords);
    const emptyDataSet = generateData(1, 0);

    const cases = [
      { dataset: firstDataSet, expectedResult: firstNumberOfSets * firstNumberOfRecords },
      { dataset: emptyDataSet, expectedResult: 0 },
      { dataset: secondDataSet, expectedResult: secondNumberOfSets * secondNumberOfRecords },
    ];
    
    test.each(cases)('mounts component and updates dataset', async ({ dataset, expectedResult }) => {              
      await this.wrapper.setProps({ data: dataset });
      expect(this.wrapper.findAll(targetIdentifier)).toHaveLength(expectedResult);
    });
  }
}