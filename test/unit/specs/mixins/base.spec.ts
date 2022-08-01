import { mount } from '@vue/test-utils';
import { useBase } from '@/mixins/base';
import { Orientation } from '@/constants';
import { data, labels } from '../mock-data';
import { ref } from '@vue/composition-api';

const orientation: Orientation = 'horizontal';

const getMixin = () => {
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
    test('should return expected object', async () => {
        const mixin = getMixin();

        expect(mixin).toBeTruthy();
        expect(mixin).toHaveProperty('computedData');
        expect(mixin.computedData.value).toHaveProperty('values');
        expect(mixin.computedData.value).toEqual(data);
        expect(mixin).toHaveProperty('containerSize');
        expect(mixin).toHaveProperty('domain');
        expect(mixin).toHaveProperty('isHorizontal');
        expect(mixin).toHaveProperty('updateSize');
    });

    test('should change width and height of containerSize', () => {
        const containerSize = { width: 123, height: 234 }
        const mixin = getMixin();

        expect(mixin.containerSize).not.toEqual(containerSize)
        mixin.updateSize(containerSize)
        expect(mixin.containerSize).toEqual(containerSize)
    })
})