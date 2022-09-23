import { mount } from '@vue/test-utils';
import { useOptions, withOptions } from '@/composables/options';
import { isRef, ref } from 'vue';

const getMixin = (options = {}, defaultOptions = {}) => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useOptions(ref(options), ref(defaultOptions));
      return mixin;
    },
  });

  return mixin;
}

describe('options.ts', () => {
  describe('useOptions', () => {
    test('should return expected object', async () => {
      const mixin = getMixin();

      expect(mixin).toHaveProperty('allOptions');
      expect(isRef(mixin.allOptions)).toBe(true);
      expect(mixin.allOptions.value).toEqual({});
    });

    test('should return expected object with custom options', async () => {
      const options = ref({ some: 'thing' })
      const mixin = getMixin(options);

      expect(mixin.allOptions.value).toEqual(options.value);
    });

    test('should return expected object with custom defaultOptions as Ref', async () => {
      const defaultOptions = ref({ some: 'thing' })
      const mixin = getMixin({}, defaultOptions);

      expect(mixin.allOptions.value).toEqual(defaultOptions.value);
    });

    test('should return expected object with custom defaultOptions not as Ref', async () => {
      const defaultOptions = { some: 'thing' };
      const mixin = getMixin({}, defaultOptions);

      expect(mixin.allOptions.value).toEqual(defaultOptions);
    });

    test('should return expected object options overwriting defaultOptions', async () => {
      const options = ref({ some: 'thing else' })
      const defaultOptions = ref({ some: 'thing' })
      const mixin = getMixin(options, defaultOptions);

      expect(mixin.allOptions.value).toEqual(options.value);
    });
  })

  describe('withOptions', () => {
    test('should return expected object', () => {
      const component = mount({
        template: '<div></div>',
        props: {
          ...withOptions()
        }
      });
      const props = component.props();

      expect(props).toHaveProperty('options')
      expect(props.options).toEqual({})
    });
  })
});