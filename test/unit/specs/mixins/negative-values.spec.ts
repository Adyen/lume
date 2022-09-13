import { mount } from '@vue/test-utils';
import { checkNegativeValues, useNegativeValues } from '@/mixins/negative-values';
import { Orientation } from '@/constants';
import { containerSize, data, xScale, yScale } from '../mock-data';
import { ref } from 'vue';
import { Scale } from "@/mixins/scales";
import { scaleLinear } from "d3-scale";
import Vue from 'vue';

export const yScaleWithNegativeValues: Scale = scaleLinear<number>()
  .domain([-100, 100])
  .range([0, containerSize.height])

const getMixin = (orientation: Orientation, useNegative = false) => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useNegativeValues(containerSize, ref(xScale), ref(useNegative ? yScaleWithNegativeValues : yScale), ref(orientation));
      return mixin;
    },
  });

  return mixin;
}

describe('negative-values.ts', () => {
  test('should spot negative values', () => {
    const negativeData = data
      .map(({ values }) => ({ values: values
        .map(({ value }) => ({ value: -1 * Math.abs(value) }))
      })
      );
    const { hasNegativeValues } = checkNegativeValues(ref(negativeData));

    expect(hasNegativeValues.value).toEqual(true);
  });

  test('should not spot negative values if there are none', () => {
    const positiveData = data
      .map(({ values }) => ({ values: values
        .map(({ value }) => ({ value: Math.abs(value) }))
      })
      );
    const { hasNegativeValues } = checkNegativeValues(ref(positiveData));

    expect(hasNegativeValues.value).toEqual(false)
  })

  describe('with vertical orientation', () => {
    const orientation: Orientation = 'vertical';
    test('should return expected object', () => {
      const mixin = getMixin(orientation);

      expect(mixin).toBeTruthy();
      expect(mixin).toHaveProperty('negativeBarAttributes');
      expect(mixin.negativeBarAttributes).toHaveProperty('value');
      expect(mixin.negativeBarAttributes.value).toHaveProperty('width')
      expect(mixin.negativeBarAttributes.value.width).toEqual(containerSize.width);
      expect(mixin.negativeBarAttributes.value).toHaveProperty('height');
      expect(mixin.negativeBarAttributes.value.height).toEqual(containerSize.height);
      expect(mixin.negativeBarAttributes.value).toHaveProperty('transform');
      expect(mixin.negativeBarAttributes.value.transform).toEqual('translate(0, 0)');
    });

    test('should return expected object with negative values',async () => {
      const mixin = getMixin(orientation, true);

      await Vue.nextTick();

      expect(mixin.negativeBarAttributes.value.width).toEqual(containerSize.width);
      expect(mixin.negativeBarAttributes.value.height).toEqual(containerSize.height / 2);
      expect(mixin.negativeBarAttributes.value.transform).toEqual(`translate(0, ${containerSize.height / 2})`);
    });
  });

  describe('with vertical orientation', () => {
    const orientation: Orientation = 'horizontal';
    test('should return expected object', () => {
      const mixin = getMixin(orientation);

      expect(mixin).toBeTruthy();
      expect(mixin).toHaveProperty('negativeBarAttributes');
      expect(mixin.negativeBarAttributes).toHaveProperty('value');
      expect(mixin.negativeBarAttributes.value).toHaveProperty('width')
      expect(mixin.negativeBarAttributes.value.width).toEqual(0);
      expect(mixin.negativeBarAttributes.value).toHaveProperty('height');
      expect(mixin.negativeBarAttributes.value.height).toEqual(containerSize.height);
      expect(mixin.negativeBarAttributes.value).toHaveProperty('transform');
      expect(mixin.negativeBarAttributes.value.transform).toEqual('translate(0, 0)');
    });

    test('should return expected object with negative values',async () => {
      const mixin = getMixin(orientation, true);

      await Vue.nextTick();

      expect(mixin.negativeBarAttributes.value.width).toEqual(0);
      expect(mixin.negativeBarAttributes.value.height).toEqual(containerSize.height);
      expect(mixin.negativeBarAttributes.value.transform).toEqual(`translate(0, 0)`);
    });
  });
})