import { VueConstructor } from 'vue';
import { mount, Wrapper } from '@vue/test-utils';

import { LumeChart } from '@/components/core';

import { generateData } from './mock-data';

type ComponentInstance = VueConstructor;
type props = Record<string, unknown>;
type WrapperInstance = Wrapper<InstanceType<typeof LumeChart>>;
type OptionsType = {
  selector?: string;
  multisetData?: number[];
};
type ContentRect = {
  width: number;
  height: number;
};

const defaultFirstNumberOfSets = 3;
const defaultFirstNumberOfRecords = 7;
const defaultSecondNumberOfSets = 4;
const defaultSecondNumberOfRecords = 5;
const defaultContentRect: ContentRect = { width: 123, height: 234 };

export class BaseTestSuite {
  private _wrapper: WrapperInstance = null;

  constructor(
    private readonly component: ComponentInstance,
    private readonly props: props
  ) {
    this._wrapper = mount(
      this.component,
      this.props ? { props: this.props } : {}
    );
  }

  public get wrapper(): WrapperInstance {
    return this._wrapper;
  }

  public set wrapper(wrapper) {
    this._wrapper = wrapper;
  }

  public run({ selector, multisetData }: OptionsType = {}): this {
    this.snapShotTest();
    if (selector)
      this.multiDataSetTest(
        selector,
        (this.props.labels as Array<string | number>)?.length ?? 0,
        this.props.chartType,
        ...multisetData
      );
    return this;
  }

  private getNumberOfRecords(chartType, numberOfLabels, numberOfRecords) {
    if (chartType === 'bar') return numberOfLabels;
    return numberOfRecords;
  }

  private multiDataSetTest(
    targetIdentifier,
    numberOfLabels,
    chartType,
    firstNumberOfSets = defaultFirstNumberOfSets,
    firstNumberOfRecords = defaultFirstNumberOfRecords,
    secondNumberOfSets = defaultSecondNumberOfSets,
    secondNumberOfRecords = defaultSecondNumberOfRecords
  ) {
    const firstDataSet = generateData(firstNumberOfSets, firstNumberOfRecords);
    const secondDataSet = generateData(
      secondNumberOfSets,
      secondNumberOfRecords
    );
    const emptyDataSet = generateData(1, 0);

    const cases = [
      {
        dataset: firstDataSet,
        expectedResult:
          firstNumberOfSets *
          this.getNumberOfRecords(
            chartType,
            numberOfLabels,
            firstNumberOfRecords
          ),
      },
      {
        dataset: emptyDataSet,
        expectedResult: this.getNumberOfRecords(chartType, numberOfLabels, 0),
      },
      {
        dataset: secondDataSet,
        expectedResult:
          secondNumberOfSets *
          this.getNumberOfRecords(
            chartType,
            numberOfLabels,
            secondNumberOfRecords
          ),
      },
    ];

    test.each(cases)(
      'mounts component and updates dataset',
      async ({ dataset, expectedResult }) => {
        await this.wrapper.setProps({ data: dataset });
        expect(this.wrapper.findAll(targetIdentifier)).toHaveLength(
          expectedResult
        );
      }
    );
  }

  private snapShotTest() {
    // expect(this.wrapper.element).toMatchSnapshot();
  }
}

class ResizeObserver {
  private el = null;
  private static _spy = null;
  private static _newContentRect = null;
  readonly decoratedCallback = null;

  constructor(private callback) {
    this.decoratedCallback = () =>
      this.callback([{ contentRect: ResizeObserver._newContentRect }]);
  }

  public static get spy() {
    return this._spy;
  }
  public static set spy(spy) {
    this._spy = spy;
  }
  public static get newContentRect() {
    return this._newContentRect;
  }
  public static set newContentRect(newContentRect) {
    this._newContentRect = newContentRect;
  }

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

export const useCustomBoundingRectClient = () => {
  let getBoundingRectClient = null;

  beforeAll(() => {
    const response = {
      width: 1,
      height: 1,
      bottom: 1,
      left: 1,
      right: 1,
      top: 1,
      x: 1,
      y: 1,
    };

    getBoundingRectClient = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = () => ({
      ...response,
      toJSON: () => response,
    });
  });

  afterAll(() => {
    Element.prototype.getBoundingClientRect = getBoundingRectClient;
  });
};

export const useCustomResizeObserver = (
  newContentRect: ContentRect = defaultContentRect
) => {
  // Note that we have to keep the behaviour of the class clean and compliant with the real ResizeObserver.
  // For that reason, if we still want to register a spy for the events, we'll have to sneak it in by having it
  // be a static property on the class itself rather than on its instance.

  let oldResizeObserver = null;
  ResizeObserver.spy = vi.fn();
  ResizeObserver.newContentRect = newContentRect;

  beforeAll(() => {
    oldResizeObserver = window.ResizeObserver;
    window.ResizeObserver = ResizeObserver;
  });

  afterAll(() => {
    window.ResizeObserver = oldResizeObserver;
  });

  return ResizeObserver.spy;
};
