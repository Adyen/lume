import { data, labels, xScale, yScale } from '../../mock-data';
import AdvSparkline from '@/charts/adv-sparkline-chart/adv-sparkline.vue';
import { options as defaultOptions } from '@/charts/adv-sparkline-chart/defaults';
import { BaseTestSuite } from "../../../reusable.test";
import { initiateCustomResizeObserverBeforeAll } from '../../../reusable.test';
import Vue from 'vue';

const sparklineChartTestSuiteFactory = (propsData) => new BaseTestSuite(AdvSparkline, propsData);

describe('adv-sparkline.vue', () => {
  const spy = initiateCustomResizeObserverBeforeAll();

  /*
   * NOTE: These first two tests are skipped, because we need a conainterSize update in order
   * to trigger the computed computedYScale property. We will return to the once that is up and running.
   * */
  test('mounts component and sets prop values', async () => {
    const wrapper = sparklineChartTestSuiteFactory({ data, labels, options: defaultOptions, xScale })
        .run()
        .wrapper;

    const el = wrapper.findComponent(AdvSparkline);
    const props = wrapper.props();

    // We need to trigger a resize for the computed properties to fall into shape
    el.trigger('resize');

    await Vue.nextTick();

    expect(el.exists()).toBe(true);

    expect(props).toHaveProperty('data');
    expect(props.data).toEqual(data);
    expect(props).toHaveProperty('labels');
    expect(props.labels).toEqual(labels);
    expect(props).toHaveProperty('options');
    expect(props.options).toEqual(defaultOptions);

    const areaPath = el.find('[data-j-sparkline__area]');
    expect(areaPath.exists()).toBe(true);
    expect(areaPath.classes().includes(`sparkline-chart__area--color-01`)).toBe(
      true
    );

    expect(wrapper.vm.$data).not.toHaveProperty('areaPathDefinition');
  });

  test('mounts component and sets custom area color', async () => {
    const areaColor = '02';
    const mutatedData = JSON.parse(JSON.stringify(data));
    mutatedData[0].areaColor = areaColor;

    const wrapper = sparklineChartTestSuiteFactory({ data: mutatedData, labels, xScale }).wrapper;

    const el = wrapper.findComponent(AdvSparkline);
    // We need to trigger a resize for the computed properties to fall into shape
    el.trigger('resize');

    await Vue.nextTick();

    const areaPath = el.find('[data-j-sparkline__area]');

    expect(
      areaPath.classes().includes(`sparkline-chart__area--color-${areaColor}`)
    ).toBe(true);
  });

  test('mounts component and checks areaPathDefinition', () => {
    const wrapper = sparklineChartTestSuiteFactory({ data, labels, xScale, yScale }).wrapper;

    const areaPathDefinition = (wrapper.vm as any).areaPathDefinition;
    expect(areaPathDefinition).toBeTruthy();
    expect(areaPathDefinition(xScale, null)).toBeFalsy();
    expect(areaPathDefinition(xScale, yScale)).toBeTruthy();
  });
});
