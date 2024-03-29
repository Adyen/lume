import { nextTick } from 'vue';

import LumeSparkline from './lume-sparkline-chart.vue';

import {
  BaseTestSuite,
  useCustomBoundingRectClient,
  useCustomResizeObserver,
} from '@test/unit/reusable.test';
import { data, labels, xScale, yScale } from '@test/unit/mock-data';

import { options as defaultOptions } from './defaults';

const sparklineChartTestSuiteFactory = (props) =>
  new BaseTestSuite(LumeSparkline, props);

describe('lume-sparkline.vue', () => {
  useCustomResizeObserver();
  useCustomBoundingRectClient();

  test('mounts component and sets prop values', async () => {
    // Note that we rely on the values coming back from the getBoundingRectClient() method, but we need to mock it
    // so that we get a non-zero value, passing consecutive steps. In jsdom the values coming back will always be zero

    const wrapper = sparklineChartTestSuiteFactory({
      data,
      labels,
      options: defaultOptions,
      xScale,
    }).run().wrapper;

    const el = wrapper.findComponent(LumeSparkline);
    const props = wrapper.props();

    // We need to trigger a resize for the computed properties to fall into shape
    const triggerElement = wrapper.find('[data-j-chart-container]');
    expect(triggerElement.exists()).toBe(true);
    wrapper.find('[data-j-chart-container]').trigger('resize');
    await nextTick();

    expect(el.exists()).toBe(true);

    expect(props).toHaveProperty('data');
    expect(props.data).toEqual(data);
    expect(props).toHaveProperty('labels');
    expect(props.labels).toEqual(labels);
    expect(props).toHaveProperty('options');
    expect(props.options).toEqual(defaultOptions);

    const areaPath = el.find('[data-j-sparkline__area]');
    expect(areaPath.exists()).toBe(true);
    expect(areaPath.classes().includes('lume-fill--faded')).toBe(true);
    expect(areaPath.classes().includes('lume-fill--skyblue')).toBe(true);
    expect(
      areaPath.classes().includes('sparkline-chart__area--transition')
    ).toBe(true);

    expect(wrapper.vm.$data).not.toHaveProperty('areaPathDefinition');
  });

  test('mounts component and sets custom area color', async () => {
    const areaColor = '02';
    const mutatedData = JSON.parse(JSON.stringify(data));
    mutatedData[0].areaColor = areaColor;

    const wrapper = sparklineChartTestSuiteFactory({
      data: mutatedData,
      labels,
      xScale,
      options: { ...defaultOptions, showArea: true },
    }).run().wrapper;

    const el = wrapper.findComponent(LumeSparkline);
    // We need to trigger a resize for the computed properties to fall into shape
    el.trigger('resize');

    await nextTick();

    const areaPath = el.find('[data-j-sparkline__area]');

    expect(areaPath.classes().includes(`lume-fill--${areaColor}`)).toBe(true);
  });

  test('transition to be disabled when the withTransition option is set to false', async () => {
    const wrapper = sparklineChartTestSuiteFactory({
      data,
      labels,
      options: { ...defaultOptions, withTransition: false },
      xScale,
    }).run().wrapper;

    const el = wrapper.findComponent(LumeSparkline);

    // We need to trigger a resize for the computed properties to fall into shape
    const triggerElement = wrapper.find('[data-j-chart-container]');
    expect(triggerElement.exists()).toBe(true);
    wrapper.find('[data-j-chart-container]').trigger('resize');
    await nextTick();

    expect(el.exists()).toBe(true);

    const areaPath = el.find('[data-j-sparkline__area]');
    expect(
      areaPath.classes().includes('sparkline-chart__area--transition')
    ).toBe(false);
  });
});
