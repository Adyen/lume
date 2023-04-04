import { mount } from '@vue/test-utils';

import LumeChart from './lume-chart.vue';

import { data, labels, xScale, yScale } from '@test/unit/mock-data';

const defaultProps = {
  data,
  labels,
  xScale,
  yScale,
};

describe('lume-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: defaultProps,
    });

    const el = wrapper.find('[data-j-lume-chart]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-lume-chart__tooltip]').exists()).toBe(false);
  });

  test('mounts component with tooltip disabled', () => {
    const wrapper = mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: {
        ...defaultProps,
        options: {
          withTooltip: false,
        },
      },
    });

    const el = wrapper.find('[data-j-lume-chart__tooltip]');
    expect(el.exists()).toBeFalsy();
  });

  // In order for this to work, we would have to alter the structure of the component that is being tested
  // We should find another way to assert this.
  test('mounts component with axes disabled', () => {
    const wrapper = mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: {
        ...defaultProps,
        options: {
          withAxes: false,
        },
      },
    });

    const el = wrapper.find('[data-j-lume-chart__axes]');
    expect(el.exists()).toBeFalsy();
  });

  test('mounts component with negative values', () => {
    const wrapper = mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: {
        ...defaultProps,
        data: [
          {
            values: data[0].values.map(({ value }) => ({ value: -1 * value })),
          },
        ],
      },
    });

    const el = wrapper.find('[data-j-lume-chart__negative-values]');
    expect(el.exists()).toBeTruthy();
  });

  test('should show tooltip on bar overlay mouseover event', async () => {
    const wrapper = mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: {
        ...defaultProps,
        options: { withTooltip: true },
      },
    });

    expect(wrapper.find('[data-j-lume-chart__tooltip]').exists()).toBe(false);
    const overlay = wrapper.find('[data-j-lume-overlay-group]');
    await overlay.trigger('mouseover');
    expect(wrapper.find('[data-j-lume-chart__tooltip]').exists()).toBe(true);
  });

  test('should show tooltip on tick-mouseover for x-axis', async () => {
    const wrapper = await mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: defaultProps,
    });

    expect(wrapper.find('[data-j-lume-chart__tooltip]').exists()).toBe(false);
    const xAxisElement = wrapper.find('[data-j-lume-chart__x-axis]');
    await xAxisElement.find('[data-j-axis__tick-label]').trigger('mouseover');
    expect(wrapper.find('[data-j-lume-chart__tooltip]').exists()).toBe(true);
  });

  test('should show tooltip on tick-mouseover for y-axis with horizontal orientation', async () => {
    const wrapper = await mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: {
        ...defaultProps,
        orientation: 'horizontal',
      },
    });

    expect(wrapper.find('[data-j-lume-chart__tooltip]').exists()).toBe(false);
    const yAxisElement = wrapper.find('[data-j-lume-chart__y-axis]');
    await yAxisElement.find('[data-j-axis__tick-label]').trigger('mouseover');
    expect(wrapper.find('[data-j-lume-chart__tooltip]').exists()).toBe(true);
  });

  test('should hide tooltip after root element hover event', async () => {
    const wrapper = await mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: defaultProps,
    });

    const overlay = wrapper.find('[data-j-lume-overlay-group]');
    await overlay.trigger('mouseover');
    expect(wrapper.find('[data-j-lume-chart__tooltip]').exists()).toBe(true);
    await wrapper.find('[data-j-chart-container__root]').trigger('mouseleave');
    expect(wrapper.find('[data-j-lume-chart__tooltip]').exists()).toBe(false);
  });

  test('should propagate click event to parent, coming from the legend', async () => {
    const wrapper = mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: defaultProps,
    });

    const legend = wrapper.find('[data-j-chart-legend__symbol-wrapper]');
    await legend.trigger('click', { value: 1 });

    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
