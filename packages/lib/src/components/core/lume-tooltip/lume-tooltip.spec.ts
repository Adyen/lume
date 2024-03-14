import { mount } from '@vue/test-utils';

import LumeTooltip from './lume-tooltip.vue';

const title = 'My title';
const mockElement = document.createElement('div');
const item1 = {
  type: 'my-type',
  color: '02',
  label: 'my-label',
  value: 'my-value',
};
const item2 = {
  type: 'my-type-2',
  color: '03',
  label: 'my-label-2',
  value: 'my-value-2',
};

const defaultProps = {
  opened: true,
  targetElement: mockElement,
  items: [item1, item2],
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
        .includes(`lume-background-color--${item1.color}`)
    ).toBeTruthy();
    expect(el.find('[data-j-tooltip__item__label]').text()).toEqual(
      item1.label
    );
    expect(el.find('[data-j-tooltip__item__value]').text()).toEqual(
      item1.value
    );
  });

  describe('summary item', () => {
    test('mount component with summary item from items array', () => {
      const wrapper = mount(LumeTooltip, {
        props: {
          ...defaultProps,
          items: [{ ...item1, isSummary: true }, item1],
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

    test('mounts component with inverse tooltip items', () => {
      const wrapper = mount(LumeTooltip, {
        props: { ...defaultProps, inverse: true },
      });

      const items = wrapper.findAll('.lume-tooltip__item');

      expect(items[0].text()).toBe(item2.label + item2.value);
    });

    describe('should format title according to options', () => {
      it('should format title with format string', () => {
        const wrapper = mount(LumeTooltip, {
          props: {
            title: 1234,
            items: [item1],
            opened: true,
            targetElement: mockElement,
            options: { titleFormat: '~s' },
          },
        });

        const titleEl = wrapper.find('[data-j-tooltip__title=""]');

        expect(titleEl.text()).toBe('1.234k');
      });
      it('should format title with to function', () => {
        const wrapper = mount(LumeTooltip, {
          props: {
            title,
            items: [item1],
            opened: true,
            targetElement: mockElement,
            options: { titleFormat: (title) => title + '!' },
          },
        });

        const titleEl = wrapper.find('[data-j-tooltip__title=""]');

        expect(titleEl.text()).toBe('My title!');
      });
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

    it('should dispatch `tooltip-mouseenter` when cursor enters nd `tooltip-mouseleave` when cursor leaves the tooltip', async () => {
      const wrapper = mount(LumeTooltip, { props: defaultProps });

      await wrapper.setProps({ targetElement: document.createElement('div') });

      const el = wrapper.find('[data-j-tooltip]');
      expect(el.exists()).toBeTruthy();

      await el.trigger('mouseenter');
      expect(wrapper.emitted()).toHaveProperty('tooltip-mouseenter');

      await el.trigger('mouseleave');
      expect(wrapper.emitted()).toHaveProperty('tooltip-mouseleave');
    });
  });
});
