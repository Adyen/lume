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

const defaultProps = {
  targetElement: mockElement,
  items: [item],
};

describe('tooltip.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeTooltip, { props: defaultProps });

    const el = wrapper.find('[data-j-tooltip]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-tooltip__title]').exists()).toBeFalsy();
  });

  test('mounts component and sets custom title prop', () => {
    const wrapper = mount(LumeTooltip, { props: { title, ...defaultProps } });

    const el = wrapper.find('[data-j-tooltip__title]');
    expect(el.exists()).toBeTruthy();
    expect(el.text()).toEqual(title);
  });

  test('mounts component and shows list of items', () => {
    const wrapper = mount(LumeTooltip, { props: defaultProps });

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

  describe('summary item', () => {
    test('mount component with summary item from items array', () => {
      const wrapper = mount(LumeTooltip, {
        props: {
          ...defaultProps,
          items: [{ ...item, isSummary: true }, item],
        },
      });

      const el = wrapper.find('[data-j-tooltip__summary-item]');
      expect(el.exists()).toBeTruthy();
    });

    test('mount component with summary item from options', () => {
      const wrapper = mount(LumeTooltip, {
        props: {
          ...defaultProps,
          options: { summary: 'test summary' },
        },
      });

      const el = wrapper.find('[data-j-tooltip__summary-item]');
      expect(el.exists()).toBeTruthy();
    });

    test('mount component with summary item from property', () => {
      const wrapper = mount(LumeTooltip, {
        props: {
          ...defaultProps,
          summary: 'test summary',
        },
      });

      const el = wrapper.find('[data-j-tooltip__summary-item]');
      expect(el.exists()).toBeTruthy();
    });
  });

  describe('Events API', () => {
    it('should dispatch `opened` when tooltip is initially displayed', () => {
      const wrapper = mount(LumeTooltip, { props: defaultProps });

      expect(wrapper.emitted()).toHaveProperty('opened');
      expect(wrapper.emitted().opened).toHaveLength(1);
    });

    it('should dispatch `moved` when tooltip `targetElement` changes', async () => {
      const wrapper = mount(LumeTooltip, { props: defaultProps });

      await wrapper.setProps({ targetElement: document.createElement('div') });

      expect(wrapper.emitted()).toHaveProperty('moved');
      expect(wrapper.emitted().moved).toHaveLength(1);
    });

    it('should dispatch `closed` when tooltip is destroyed', () => {
      const wrapper = mount(LumeTooltip, { props: defaultProps });

      wrapper.unmount();

      expect(wrapper.emitted()).toHaveProperty('closed');
      expect(wrapper.emitted().closed).toHaveLength(1);
    });
  });
});
