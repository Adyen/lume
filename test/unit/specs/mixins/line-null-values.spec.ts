import { mount } from '@vue/test-utils';
import { useLineNullValues } from '@/mixins/line-null-values';
import { computed } from 'vue';
import { data } from '../mock-data';

const getMixin = localData => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useLineNullValues(computed(() => localData));
      return mixin;
    },
  });

  return mixin;
}

describe('line-null-values.ts', () => {
  test('should return expected object', () => {
    const mixin = getMixin(data);

    expect(mixin).toHaveProperty('computedLineData');
    expect(mixin.computedLineData.value[0]).toHaveProperty('isDashed');
    expect(data[0].values.every((_, index) => mixin.computedLineData.value[0].isDashed(index) === false)).toEqual(true);
    expect(mixin.computedLineData.value[0]).toHaveProperty('values');
    expect(mixin.computedLineData.value[0].values).toEqual(data[0].values);
  });

  test('should return expected object when some values are null', () => {
    const mutatedIndex = 1;
    const dataWithNullValues = JSON.parse(JSON.stringify(data));
    const lastIndex = dataWithNullValues[0].values.length-1;

    dataWithNullValues[0].values[mutatedIndex].value = null;
    dataWithNullValues[0].values[lastIndex].value = null;
    const mixin = getMixin(dataWithNullValues);

    expect(mixin.computedLineData.value[0].isDashed(mutatedIndex)).toEqual(true);
    expect(mixin.computedLineData.value[0]).toHaveProperty('values');
    expect(mixin.computedLineData.value[0].values[mutatedIndex]).toHaveProperty('label');
    expect(mixin.computedLineData.value[0].values[mutatedIndex].label).toEqual('No data');
    expect(mixin.computedLineData.value[0].values[lastIndex].label).toEqual('No data');

    const prevValue = mixin.computedLineData.value[0].values[mutatedIndex - 1].value;
    const nextValue = mixin.computedLineData.value[0].values[mutatedIndex + 1].value;
    const expectedInterpolatedValue = (prevValue + nextValue) / 2;
    expect(mixin.computedLineData.value[0].values[mutatedIndex].value).toEqual(expectedInterpolatedValue);
  });
});