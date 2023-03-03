import { ref } from 'vue';
import { mount } from '@vue/test-utils';

import { useBase, withBase } from './base';

import { data, labels } from '@test/unit/mock-data';

import { Orientation } from '@/utils/constants';

const getMixin = (orientation: Orientation = 'horizontal') => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useBase(ref(data), ref(labels), null, null, ref(orientation));
      return mixin;
    },
  });

  return mixin;
};

describe('base.ts', () => {
  describe('getMixin', () => {
    test('should return expected object', async () => {
      const mixin = getMixin();

      expect(mixin).toBeTruthy();
      expect(mixin).toHaveProperty('internalData');

      const dataset = mixin.internalData.value[0];
      expect(dataset).toHaveProperty('values');
      expect(dataset).toHaveProperty('color');
      expect(mixin).toHaveProperty('containerSize');
      expect(mixin).toHaveProperty('updateSize');
    });

    test('should change width and height of containerSize with vertical orientation', () => {
      const containerSize = { width: 123, height: 234 };
      const mixin = getMixin('vertical');

      expect(mixin.containerSize).not.toEqual(containerSize);
      mixin.updateSize(containerSize);
      expect(mixin.containerSize).toEqual(containerSize);
    });

    test('should change width only of containerSize with horizontal orientation', () => {
      const containerSize = { width: 123, height: 234 };
      const mixin = getMixin();

      expect(mixin.containerSize).not.toEqual(containerSize);
      mixin.updateSize(containerSize);
      expect(mixin.containerSize.width).toEqual(containerSize.width);
      expect(mixin.containerSize.height).not.toEqual(containerSize.height);
    });
  });

  describe('withBase', () => {
    test('should not have labels as a required property', () => {
      let mixin = null;

      const wrapper = mount(
        {
          template: '<div></div>',
          props: {
            ...withBase(null),
          },
          setup() {
            mixin = useBase(ref(data));
            return mixin;
          },
        },
        { props: { data } }
      );

      expect(wrapper.vm.$props.labels).toEqual(undefined);
    });

    test('should run custom validator on prop', () => {
      const component = {
        template: '<div></div>',
        props: {
          ...withBase((data) => !!data && data[0].values[0] === 123),
        },
        // Validation for our data set will fail
      };

      expect(component.props.data.validator([{ values: [123] }])).toBe(true);
      expect(component.props.data.validator([{ values: [321] }])).toBe(false);
    });
  });
});
