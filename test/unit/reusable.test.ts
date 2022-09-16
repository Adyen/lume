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

class ResizeObserver {
  private el = null;
  private static _spy = null;
  private static _newContentRect = { width: 123, height: 234 };
  readonly decoratedCallback = null;

  constructor(
      private callback
  ) {
    this.decoratedCallback = () => this.callback([{ contentRect: ResizeObserver._newContentRect } ])
  }

  public static get spy() { return this._spy; }
  public static set spy(spy) { this._spy = spy; }

  public observe(el) {
    this.el?.removeEventListener('resize', this.decoratedCallback);
    this.el = el;
    this.el.addEventListener('resize', this.decoratedCallback);
    ResizeObserver._spy('observe');
  }

  public unobserve() {
    this.el.removeEventListener('resize', this.decoratedCallback);
    ResizeObserver._spy('unobserve');
  }

  public disconnect() {
    // Do nothing
  }
}

export const initiateCustomResizeObserverBeforeAll = () => {
  // Note that we have to keep the behaviour of the class clean and compliant with the real ResizeObserver.
  // For that reason, if we still want to register a spy for the events, we'll have to sneak it in by having it
  // be a static property on the class itself rather than on its instance.
  ResizeObserver.spy = jest.fn();

  beforeAll(() => {
    window.ResizeObserver = ResizeObserver;
  });

  return ResizeObserver.spy;
}