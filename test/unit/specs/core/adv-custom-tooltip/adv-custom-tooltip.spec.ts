import { mount } from '@vue/test-utils';
import AdvCustomTooltip from '@/core/adv-custom-tooltip';
import { generateData } from '../../mock-data';
import Vue from 'vue';

const getWrapped = (data = generateData(2, 7), opened = true, hoveredIndex = null, mountTargetElement = false, returnValue = {}) => {
    return mount({
        components: { AdvCustomTooltip },
        props: {
            data: { type: Array, required: true },
            opened: { type: Boolean, required: true },
            mountTargetElement: { type: Boolean, required: true }
        },
        data: () => ({ isMounted: false }),
        mounted() {
            // Mock in a method that offers us a way to check what getBoundingClientRect on the targetElement returns
            this.$refs.targetElement.getBoundingClientRect = () => returnValue;
            this.isMounted = true;
        },
        template: `
            <div>
                <div
                    ref="targetElement"
                    data-j-target-element
                    style="position: absolute; top: 100px; left: 200px;"
                ></div>

                <adv-custom-tooltip
                    v-if="isMounted"
                    :data="data"
                    :opened="opened" 
                    ${hoveredIndex ? `:hovered-index="${hoveredIndex}"` : ''}
                    ${mountTargetElement ? ':target-element="$refs.targetElement"' : ''}
                >
                  <template #content="{ data, hoveredIndex }">
                    <div data-j-final-destination :hovered-index="hoveredIndex">
                      {{ data[0].values[0].value }}
                    </div>
                  </template>
                </adv-custom-tooltip>
            </div>
        `
    } as any, { propsData: { data, opened, mountTargetElement }})
};

describe('adv-custom-tooltip.vue', () => {
    test('mounts component', async () => {
        const data = generateData(2, 7);
        const wrapped = getWrapped(data, true);

        await Vue.nextTick();

        const el = wrapped.find('[data-j-custom-tooltip]');
        expect(el.exists()).toBeTruthy();
        expect(el.attributes()['style']).toEqual('top: 0px; left: 0px;');
        expect(wrapped.find('[data-j-final-destination]').attributes()['hovered-index']).toEqual('-1')
    });

    test('should not expose root element if opened is set to false', () => {
        const data = generateData(2, 7);
        const wrapper = mount(AdvCustomTooltip, {
            propsData: {
                data,
                opened: false
            }
        });

        expect(wrapper.find('[data-j-custom-tooltip]').exists()).toBeFalsy();
    });

    test('should expose the correct hovered index inside the slot', async () => {
        const data = generateData(2, 7);
        const wrapped = getWrapped(data, true, 2);

        await Vue.nextTick();

        expect(wrapped.find('[data-j-final-destination]').attributes()['hovered-index']).toEqual('2')
        expect(wrapped.find('[data-j-final-destination]').text()).toEqual(data[0].values[0].value.toString())
    });

    test('should mount the tooltip on the designated target element', async () => {
        const data = generateData(2, 7);
        const returnValue = { x: 100, y: 200 };
        const wrapped = getWrapped(data, true, null, true, returnValue);

        await Vue.nextTick();

        const el = wrapped.find('[data-j-custom-tooltip]');
        expect(el.attributes()['style']).toEqual(`top: ${returnValue.y}px; left: ${returnValue.x}px;`);
    });

    test('should display the value of the hovered entry', () => {
        const hoveredIndex = 1;
        const data = generateData(2, 7);
        const wrapper = mount(AdvCustomTooltip, {
            propsData: {
                data,
                opened: true,
                hoveredIndex
            }
        });

        const el = wrapper.find('[data-j-custom-tooltip__default-display]');
        expect(el.text()).toEqual(data[0].values[hoveredIndex].value.toString());
    });
});
