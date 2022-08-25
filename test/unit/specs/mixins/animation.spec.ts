import { mount } from '@vue/test-utils';
import { useAnimation } from '@/mixins/animation';
import { data } from '../mock-data';
import { computed } from '@vue/composition-api';

const flatData = data[0].values.map(({ value }) => value);

const getMixin = () => {
  let mixin = null;
  mount({
    template: '<div></div>',
    setup() {
      mixin = useAnimation(computed(() => [flatData]));
      return mixin;
    },
  });

  return mixin;
};

describe('animation.ts', () => {
  test('should return expected object', () => {
    const mixin = getMixin();

    expect(mixin).toBeTruthy();
    expect(mixin).toHaveProperty('animate');
    expect(mixin.animate.value).toBe(false);
    expect(mixin).toHaveProperty('suspendedData');
    expect(mixin.suspendedData.value).toEqual([flatData.map(() => 0)]);
  });

  test('should change settings after mounting has been completed', async () => {
    const mixin = getMixin();

    // Mixin also relies on zero timeout, so we need to mock that behavior here. Will be fixed.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mixin.animate.value).toBe(true);
    expect(mixin.suspendedData.value).toEqual([flatData]);
  });
});
