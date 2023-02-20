import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';

import { useResizeObserver } from './resize';

import { useCustomResizeObserver } from '@test/unit/reusable.test';

const newDimensions = {
  dimensions: {
    width: 123,
    height: 234,
  },
};

const getResizeMixin = (children) => {
  let mixin = null;
  const wrapper = shallowMount({
    setup() {
      mixin = useResizeObserver();
      return mixin;
    },
    template: `<div>${children}</div>`,
  });

  return { wrapper, mixin };
};

describe('resize.ts', () => {
  const spy = useCustomResizeObserver(newDimensions.dimensions);

  test('should return expected object state and ref', async () => {
    const { wrapper, mixin } = await getResizeMixin(
      '<div ref="resizeRef" data-j-resize-root></div>'
    );

    // NOTE: We need to trigger the element resize, not the window
    wrapper.find('[data-j-resize-root]').trigger('resize');
    await Vue.nextTick();

    const el = wrapper.find('[data-j-resize-root]').element;
    expect(mixin.resizeRef.value).toEqual(el);
    expect(mixin.resizeState).toEqual(newDimensions);
    expect(spy).toHaveBeenCalledWith('observe');
    expect(spy).not.toHaveBeenCalledWith('unobserve');
  });

  test('should call the unobserve method when component is being destroyed', () => {
    const { wrapper } = getResizeMixin(
      '<div ref="resizeRef" data-j-resize-root></div>'
    );

    wrapper.destroy();
    expect(spy).toHaveBeenCalledWith('unobserve');
  });

  test('should call the resize observer callback when element is being resized', () => {
    const { mixin } = getResizeMixin(
      '<div ref="resizeRef" data-j-resize-root></div>'
    );
    expect(mixin.resizeState.dimensions).not.toEqual({
      width: 123,
      height: 234,
    });
    mixin.resizeRef.value.dispatchEvent(new Event('resize'));
    expect(mixin.resizeState.dimensions).toEqual({ width: 123, height: 234 });
  });
});
