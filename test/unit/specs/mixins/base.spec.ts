import { mount } from '@vue/test-utils';
import { withBase, useBase } from '@/mixins/base';
import { NUMBER_OF_COLORS, Orientation } from '@/constants';
import { data, labels } from '../mock-data';
import { ref } from 'vue';

const getMixin = (orientation: Orientation = 'horizontal') => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useBase(ref(data), ref(labels), ref(orientation));
      return mixin;
    },
  });

  return mixin;
}

describe('base.ts', () => {
  describe('getMixin', () => {
    test('should return expected object', async () => {
      const mixin = getMixin();

      expect(mixin).toBeTruthy();
      expect(mixin).toHaveProperty('computedData');
      expect(mixin.computedData.value).toHaveProperty('values');
      expect(mixin.computedData.value).toEqual(data.map((record, index) => ({
        ...record,
        color: record.color || `0${1 + (index % NUMBER_OF_COLORS)}`
      })));
      expect(mixin).toHaveProperty('containerSize');
      expect(mixin).toHaveProperty('updateSize');
    });

    test('should change width and height of containerSize with vertical orientation', () => {
      const containerSize = { width: 123, height: 234 }
      const mixin = getMixin('vertical');

      expect(mixin.containerSize).not.toEqual(containerSize)
      mixin.updateSize(containerSize)
      expect(mixin.containerSize).toEqual(containerSize)
    })

    test('should change width only of containerSize with horizontal orientation', () => {
      const containerSize = { width: 123, height: 234 }
      const mixin = getMixin();

      expect(mixin.containerSize).not.toEqual(containerSize)
      mixin.updateSize(containerSize)
      expect(mixin.containerSize.width).toEqual(containerSize.width);
      expect(mixin.containerSize.height).not.toEqual(containerSize.height);
    });
  });

  describe('withBase', () => {
    test('should not have labels as a required property', () => {
      let mixin = null;

      const wrapper = mount({
        template: '<div></div>',
        props: {
          ...withBase(null, false)
        },
        setup() {
          mixin = useBase(ref(data));
          return mixin;
        }
      }, { propsData: { data } });

      expect(wrapper.vm.$props.labels).toEqual(null);
    });

    test('should have labels as a required property', () => {
      const component = {
        template: '<div></div>',
        props: {
          ...withBase(null, true)
        },
        // Validation for our data set will fail
      };

      expect(component.props.labels.required).toBe(true)
    })

    test('should run custom validator on prop', () => {
      const component = {
        template: '<div></div>',
        props: {
          ...withBase(data => !!data && data[0].values[0] === 123, false)
        },
        // Validation for our data set will fail
      };

      expect(component.props.data.validator([{ values: [123] }])).toBe(true);
      expect(component.props.data.validator([{ values: [321] }])).toBe(false);
    })
  });
})