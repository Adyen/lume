import { mount } from '@vue/test-utils';

import { withGroupProps } from './group-props';

const getMixin = () => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = withGroupProps();
      return mixin;
    },
  });

  return mixin;
};

describe('props.ts', () => {
  test('should return expected object', () => {
    const mixin = getMixin();

    expect(mixin).toHaveProperty('data');
    expect(mixin.data).toHaveProperty('required');
    expect(mixin.data.required).toBe(true);
    expect(mixin.data).toHaveProperty('type');
    expect(mixin.data.type).toEqual(Array);

    expect(mixin).toHaveProperty('labels');
    expect(mixin.labels).toHaveProperty('default');
    expect(mixin.labels.default()).toEqual([]);
    expect(mixin.labels).toHaveProperty('type');
    expect(mixin.labels.type).toEqual(Array);

    expect(mixin).toHaveProperty('xScale');
    expect(mixin.xScale).toHaveProperty('default');
    expect(mixin.xScale.default()).toBe(null);
    expect(mixin.xScale).toHaveProperty('type');
    expect(mixin.xScale.type).toEqual(Function);

    expect(mixin).toHaveProperty('yScale');
    expect(mixin.yScale).toHaveProperty('default');
    expect(mixin.yScale.default()).toBe(null);
    expect(mixin.yScale).toHaveProperty('type');
    expect(mixin.yScale.type).toEqual(Function);

    expect(mixin).toHaveProperty('hoveredIndex');
    expect(mixin.hoveredIndex).toHaveProperty('default');
    expect(mixin.hoveredIndex.default).toEqual(-1);
    expect(mixin.hoveredIndex).toHaveProperty('type');
    expect(mixin.hoveredIndex.type).toEqual(Number);

    expect(mixin).toHaveProperty('options');
    expect(mixin.options).toHaveProperty('default');
    expect(mixin.options.default()).toEqual({});
    expect(mixin.options).toHaveProperty('type');
    expect(mixin.options.type).toEqual(Object);
  });
});
