import { useBase } from '@/mixins/base';
import { Orientation } from '@/constants';
import { data, labels } from '../mock-data';
import VueCompositionAPI from '@vue/composition-api';
import { ref } from '@vue/composition-api';
import Vue from 'vue';

Vue.use(VueCompositionAPI);

describe.skip('base.ts', () => {
    const orientation: Orientation = 'horizontal';

    test('should return expected object', () => {
        const mixin = useBase(ref(data), ref(labels), ref(orientation));

        expect(mixin).toBeTruthy()
    })
})