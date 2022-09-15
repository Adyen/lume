import { shallowMount } from '@vue/test-utils';
import { useResizeObserver } from '@/mixins/resize';

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
  const spy = jest.fn();

  beforeAll(() => {
    class ResizeObserver {
      private el = null;
      readonly decoratedCallback = null;

      constructor(
          private callback
      ) {
        this.decoratedCallback = () => this.callback([{ contentRect: { width: 123, height: 234 } } ])
      }

      public observe(el) {
        this.el?.removeEventListener('resize', this.decoratedCallback);
        this.el = el;
        this.el.addEventListener('resize', this.decoratedCallback);
        spy('observe');
      }

      public unobserve() {
        this.el.removeEventListener('resize', this.decoratedCallback);
        spy('unobserve');
      }

      public disconnect() {
        // Do nothing
      }
    }

    window.ResizeObserver = ResizeObserver;
  });

  test('should return expected object state and ref', async () => {
    const expected = {
      dimensions: {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
      },
    };
    const { wrapper, mixin } = await getResizeMixin(
      '<div ref="resizeRef" data-j-resize-root></div>'
    );

    const el = wrapper.find('[data-j-resize-root]').element;
    expect(mixin.resizeRef.value).toEqual(el);
    expect(mixin.resizeState).toEqual(expected);
    expect(spy).toHaveBeenCalledWith('observe');
    expect(spy).not.toHaveBeenCalledWith('unobserve');

    await window.dispatchEvent(new Event('resize'));
  });

  test('should call the unobserve method when component is being destroyed', async () => {
    const { wrapper } = await getResizeMixin(
      '<div ref="resizeRef" data-j-resize-root></div>'
    );

    wrapper.destroy();
    expect(spy).toHaveBeenCalledWith('unobserve');
  });

  test('should call the resize observer callback when element is being resized', async () => {
    const { mixin } = await getResizeMixin('<div ref="resizeRef" data-j-resize-root></div>');
    expect(mixin.resizeState.dimensions).not.toEqual({ width: 123, height: 234 });
    mixin.resizeRef.value.dispatchEvent(new Event('resize'));
    expect(mixin.resizeState.dimensions).toEqual({ width: 123, height: 234 });
  })
});
