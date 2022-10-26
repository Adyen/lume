import { ref } from 'vue';
import { mount } from '@vue/test-utils';

import {
  getPaddedScale,
  getXByIndex,
  isScale,
  useBaseScales,
  withScales,
} from './scales';

import { containerSize, data, labels } from '@test/unit/mock-data';

import { Orientation, PADDING_HORIZONTAL, PADDING_VERTICAL } from '@/constants';
import { ChartOptions } from '@/composables/options';

const aboveZeroDataSet = [
  { values: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }] },
];
const flatData = data.reduce(
  (acc, { values }) => [
    ...acc,
    ...values.reduce((acc2, { value }) => [...acc2, value], []),
  ],
  []
);
const min = Math.min(...flatData);
const max = Math.max(...flatData);

const getMixin = async (
  data,
  orientation: Orientation = 'horizontal',
  options: ChartOptions = {}
) => {
  let mixin = null;

  await mount({
    template: '<div></div>',
    setup() {
      mixin = useBaseScales(
        ref(data),
        ref(labels),
        containerSize,
        ref(orientation),
        ref(options)
      );
      return mixin;
    },
  });

  return mixin;
};

describe('scales.ts', () => {
  describe('getMixin', () => {
    test('should return expected object', async () => {
      const mixin = await getMixin(data);

      expect(mixin).toBeTruthy();
      expect(mixin).toHaveProperty('xScale');
      expect(mixin.xScale.value?.domain()).toEqual([min, max]);
      expect(mixin.xScale.value?.range()).toEqual([0, containerSize.width]);
      expect(mixin).toHaveProperty('yScale');
      expect(mixin.yScale.value?.domain()).toEqual(labels);
      expect(mixin.yScale.value?.range()).toEqual([0, containerSize.height]);
    });

    test('should return expected object with custom orientation', async () => {
      const mixin = await getMixin(data, 'vertical');

      expect(mixin).toBeTruthy();
      expect(mixin).toHaveProperty('xScale');
      expect(mixin.yScale.value?.domain()).toEqual([max, min]);
      expect(mixin.yScale.value?.range()).toEqual([0, containerSize.height]);
      expect(mixin).toHaveProperty('yScale');
      expect(mixin.xScale.value?.domain()).toEqual(labels);
      expect(mixin.xScale.value?.range()).toEqual([0, containerSize.width]);
    });

    test('should start scale on lowest value in dataset', async () => {
      const mixin = await getMixin(aboveZeroDataSet, 'horizontal', {
        startOnZero: false,
      });

      expect(mixin.xScale.value.domain()[0]).toEqual(
        Math.min(...aboveZeroDataSet[0].values.map(({ value }) => value))
      );
    });

    test('should start scale on 0', async () => {
      const mixin = await getMixin(aboveZeroDataSet, 'horizontal', {
        startOnZero: true,
      });

      expect(mixin.xScale.value.domain()[0]).toEqual(0);
    });

    test('should return a range of [0, 0] for the linear scale when no values are specified', async () => {
      const { xScale } = await getMixin([], 'horizontal', {
        startOnZero: false,
      });

      expect(xScale.value.domain()).toEqual([0, 0]);
    });
  });

  describe('withScales', () => {
    test('should return expected properties', async () => {
      const wrapper = mount({
        template: '<div></div>',
        props: {
          ...withScales(),
        },
      });

      expect(wrapper.vm.$props).toEqual({ xScale: null, yScale: null });
    });
  });

  describe('isScale', () => {
    test('should confirm that the scales are of the type Scale', async () => {
      const { xScale, yScale } = await getMixin(data);

      expect(isScale(xScale.value)).toBe(true);
      expect(isScale(yScale.value)).toBe(true);
    });

    test('should return false if provided argument is not of type Scale', () => {
      expect(isScale(null)).toBe(false);
    });
  });

  describe('getXByIndex', () => {
    test('should give correct x value by index', async () => {
      const index = 1;
      const { xScale, yScale } = await getMixin(data);

      expect(getXByIndex(xScale.value, index)).toEqual(xScale.value(index));
      expect(getXByIndex(yScale.value, index)).toEqual(
        yScale.value.bandwidth() / 2 +
          yScale.value(yScale.value.domain()[index])
      );
    });
  });

  describe('getPaddedScale', () => {
    test('should return scale with horizontal padding as padding if so indicated', async () => {
      const { yScale } = await getMixin(data);

      const paddedScale = getPaddedScale(yScale.value, 'horizontal');
      expect(paddedScale.paddingInner()).toEqual(PADDING_HORIZONTAL);
      expect(paddedScale.paddingOuter()).toEqual(PADDING_HORIZONTAL / 2);
    });

    test('should return scale with vertical padding as padding if so indicated', async () => {
      const { yScale } = await getMixin(data);

      const paddedScale = getPaddedScale(yScale.value, 'vertical');
      expect(paddedScale.paddingInner()).toEqual(PADDING_VERTICAL);
      expect(paddedScale.paddingOuter()).toEqual(PADDING_VERTICAL / 2);
    });

    test('should return scale with custom padding', async () => {
      const { yScale } = await getMixin(data);

      const paddedScale = getPaddedScale(yScale.value, 'horizontal', {
        padding: 1,
      });

      expect(paddedScale.paddingInner()).toEqual(1);
      expect(paddedScale.paddingOuter()).toEqual(0.5);
    });

    test('should return scale with custom paddingInner', async () => {
      const { yScale } = await getMixin(data);

      const paddedScale = getPaddedScale(yScale.value, 'horizontal', {
        paddingInner: 1,
      });

      expect(paddedScale.paddingInner()).toEqual(1);
      expect(paddedScale.paddingOuter()).toEqual(PADDING_VERTICAL / 2);
    });

    test('should return scale with custom paddingOuter', async () => {
      const { yScale } = await getMixin(data);

      const paddedScale = getPaddedScale(yScale.value, 'horizontal', {
        paddingOuter: 1,
      });

      expect(paddedScale.paddingInner()).toEqual(PADDING_VERTICAL);
      expect(paddedScale.paddingOuter()).toEqual(1);
    });
  });
});
