import { mount } from '@vue/test-utils';

import LumeTooltip from './lume-tooltip.vue';

const title = 'My title';
const mockElement = document.createElement('div');
const item = {
  type: 'my-type',
  color: '02',
  label: 'my-label',
  value: 'my-value',
};

describe('tooltip.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeTooltip, {
      propsData: { element: mockElement },
    });

    const el = wrapper.find('[data-j-tooltip]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-tooltip__title]').exists()).toBeFalsy();
  });

  test('mounts component and sets custom title prop', () => {
    const wrapper = mount(LumeTooltip, {
      propsData: { title, element: mockElement },
    });

    const el = wrapper.find('[data-j-tooltip__title]');
    expect(el.exists()).toBeTruthy();
    expect(el.text()).toEqual(title);
  });

  test('mounts component and shows list of items', () => {
    const wrapper = mount(LumeTooltip, {
      propsData: { items: [item], element: mockElement },
    });

    const el = wrapper.find('[data-j-tooltip__item]');
    expect(el.exists()).toBeTruthy();
    expect(
      el
        .find('[data-j-tooltip__item__symbol]')
        .classes()
        .includes(`lume-background-color--${item.color}`)
    ).toBeTruthy();
    expect(el.find('[data-j-tooltip__item__label]').text()).toEqual(item.label);
    expect(el.find('[data-j-tooltip__item__value]').text()).toEqual(item.value);
  });
});
