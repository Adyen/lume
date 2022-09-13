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
type OptionsType = {
  selector?: string,
  multisetData?: number[]
}
export class BaseTestSuite {
  private _wrapper: WrapperInstance = null;

  constructor(private readonly component: ComponentInstance, private readonly propsData: PropsData) {
    this._wrapper = mount(this.component, this.propsData ? { propsData: this.propsData } : {});
  }

  public get wrapper(): WrapperInstance {
    return this._wrapper;
  }

  public set wrapper(wrapper) {
    this._wrapper = wrapper;
  }

  public run({ selector, multisetData }: OptionsType = {}): this {    
    this.snapShotTest();
    if(selector) this.multiDataSetTest(selector, ...multisetData);
    return this;
  }

  private multiDataSetTest(
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

  private snapShotTest() {
    expect(this.wrapper.element).toMatchSnapshot();
  }
}