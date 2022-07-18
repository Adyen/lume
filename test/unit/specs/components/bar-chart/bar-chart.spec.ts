// Import the `mount()` method from Vue Test Utils
import { mount } from '@vue/test-utils';
import SingleBarChart from '../../../../../src/core/bar/bar.vue';

test('displays message', () => {
    // mount() returns a wrapped Vue component we can interact with
    const wrapper = mount(SingleBarChart, {
        propsData: {
            width: 100,
            height: 100,
            fillClass: 'my-class',
        }
    })

    // Assert the rendered text of the component
    expect(wrapper.find('[data-j-bar]').exists()).toBeTruthy()
});
