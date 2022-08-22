import { mount } from '@vue/test-utils';
import { useResizeObserver } from '@/mixins/resize';
import Vue from 'vue';

const getResizeMixin = () => {
    let mixin = null;
    const wrapper = mount({
        template: '<div ref="resizeRef" data-j-resize-root></div>',
        setup() {
            mixin = useResizeObserver();
            return mixin;
        }
    });

    return { wrapper, mixin };
}

describe('resize.ts', () => {
    test('should return expected object state and ref', async () => {
        const expected = { dimensions: { bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0 }};
        const { wrapper, mixin } = await getResizeMixin();

        const el = wrapper.element;
        expect(mixin.resizeRef.value).toEqual(el);
        expect(mixin.resizeState).toEqual(expected);
    });
});