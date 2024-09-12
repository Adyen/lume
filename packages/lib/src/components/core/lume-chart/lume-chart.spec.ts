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

  test('mounts component with empty (null) data', () => {
    const wrapper = mount(LumeChart, {
      slots: {
        groups: 'Mock groups',
      },
      props: {
        ...defaultProps,
        data: [
          {
            values: [null, null, null, null, null, null, null],
            label: 'mock data',
          },
        ],
      },
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

  describe('Events API', () => {
    it('should dispatch `rendered` once when mounted', () => {
      const wrapper = mount(LumeChart, {
        slots: { groups: 'Mock groups' },
        props: defaultProps,
      });

      expect(wrapper.emitted()).toHaveProperty('rendered');
      expect(wrapper.emitted().rendered).toHaveLength(1);
    });

    it('should dispatch `resize` when chart container size changes', async () => {
      const wrapper = mount(LumeChart, {
        slots: { groups: 'Mock groups' },
        props: defaultProps,
      });

      await wrapper
        .find('[data-j-chart-container=""]')
        .trigger('resize', { width: 600, height: 600 });

      expect(wrapper.emitted()).toHaveProperty('resize');
      expect(wrapper.emitted().resize).toHaveLength(1);
    });

    it('should dispatch `data-changed` if provided data changes', async () => {
      const wrapper = mount(LumeChart, {
        slots: { groups: 'Mock groups' },
        props: defaultProps,
      });

      await wrapper.setProps({ data: [...defaultProps.data] });

      expect(wrapper.emitted()).toHaveProperty('data-changed');
      expect(wrapper.emitted()['data-changed']).toHaveLength(1);
    });

    it('should dispatch `labels-changed` if provided labels changes', async () => {
      const wrapper = mount(LumeChart, {
        slots: { groups: 'Mock groups' },
        props: defaultProps,
      });

      await wrapper.setProps({ labels: [...defaultProps.labels] });

      expect(wrapper.emitted()).toHaveProperty('labels-changed');
      expect(wrapper.emitted()['labels-changed']).toHaveLength(1);
    });

    it('should dispatch `chart-click` if user clicks somewhere in the SVG element', async () => {
      const wrapper = mount(LumeChart, {
        slots: { groups: 'Mock groups' },
        props: defaultProps,
      });

      await wrapper.find('[data-j-chart-container__root=""]').trigger('click');

      expect(wrapper.emitted()).toHaveProperty('chart-click');
      expect(wrapper.emitted()['chart-click']).toHaveLength(1);
    });

    it('should dispatch `chart-mouseenter` if user moves mouse over the SVG element', async () => {
      const wrapper = mount(LumeChart, {
        slots: { groups: 'Mock groups' },
        props: defaultProps,
      });

      await wrapper
        .find('[data-j-chart-container__root=""]')
        .trigger('mouseenter');

      expect(wrapper.emitted()).toHaveProperty('chart-mouseenter');
      expect(wrapper.emitted()['chart-mouseenter']).toHaveLength(1);
    });

    it('should dispatch `chart-mouseleave` if user moves mouse over the SVG element', async () => {
      const wrapper = mount(LumeChart, {
        slots: { groups: 'Mock groups' },
        props: defaultProps,
      });

      await wrapper
        .find('[data-j-chart-container__root=""]')
        .trigger('mouseleave');

      await waitFor(() => {
        expect(wrapper.emitted()).toHaveProperty('chart-mouseleave');
        expect(wrapper.emitted()['chart-mouseleave']).toHaveLength(1);
      });
    });

    describe('Events API - Axes, Legend', () => {
      const wrapper = mount(LumeChart, {
        slots: { groups: 'Mock groups' },
        props: defaultProps,
      });

      const xAxis = wrapper.findComponent('[data-j-lume-chart__x-axis=""]');
      const xAxisTick = xAxis.find('[data-j-axis__tick=""]');
      const yAxis = wrapper.findComponent('[data-j-lume-chart__y-axis=""]');
      const yAxisTick = yAxis.find('[data-j-axis__tick=""]');

      const legend = wrapper.find('[data-j-lume-chart__legend=""]');
      const legendItem = legend.find(
        '[data-j-chart-legend__symbol-wrapper=""]'
      );

      it('should dispatch `axis-` events if user clicks or hovers any axis', async () => {
        await xAxisTick.trigger('click');
        await xAxisTick.trigger('mouseenter');
        await xAxis.trigger('mouseleave');

        await yAxisTick.trigger('click');
        await yAxisTick.trigger('mouseenter');
        await yAxis.trigger('mouseleave');

        expect(wrapper.emitted()).toHaveProperty('axis-click');
        expect(wrapper.emitted()['axis-click']).toHaveLength(2);

        expect(wrapper.emitted()).toHaveProperty('axis-mouseenter');
        expect(wrapper.emitted()['axis-mouseenter']).toHaveLength(2);

        expect(wrapper.emitted()).toHaveProperty('axis-mouseleave');
        expect(wrapper.emitted()['axis-mouseleave']).toHaveLength(2);
      });

      it('should dispatch `legend-` events if user clicks or hovers the chart legend', async () => {
        await legendItem.trigger('click');
        await legendItem.trigger('mouseenter');
        await legend.trigger('mouseleave');

        expect(wrapper.emitted()).toHaveProperty('legend-click');
        expect(wrapper.emitted()['legend-click']).toHaveLength(1);

        expect(wrapper.emitted()).toHaveProperty('legend-mouseenter');
        expect(wrapper.emitted()['legend-mouseenter']).toHaveLength(1);

        expect(wrapper.emitted()).toHaveProperty('legend-mouseleave');
        expect(wrapper.emitted()['legend-mouseleave']).toHaveLength(1);
      });
    });
  });
});
