import { mount } from '@vue/test-utils';
import AdvChart from '@/core/adv-chart/adv-chart.vue';
import { data, labels, xScale, yScale } from '../../mock-data';

const defaultProps = {
  data,
  labels,
  xScale,
  yScale
}

describe('adv-chart.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(AdvChart, {
      slots: {
        groups: 'Mock groups'
      },
      propsData: defaultProps
    })

    const el = wrapper.find('[data-j-adv-chart]');
    expect(el.exists()).toBeTruthy()
    expect(el.find('[data-j-adv-chart__tooltip]').exists()).toBe(false)
  })

  test('mounts component with tooltip disabled', () => {
    const wrapper = mount(AdvChart, {
      slots: {
        groups: 'Mock groups'
      },
      propsData: {
        ...defaultProps,
        options: {
          withTooltip: false
        }
      }
    })

    const el = wrapper.find('[data-j-adv-chart__tooltip]');
    expect(el.exists()).toBeFalsy()
  });

  // In order for this to work, we would have to alter the structure of the component that is being tested
  // We should find another way to assert this.
  test('mounts component with axes disabled', () => {
    const wrapper = mount(AdvChart, {
      slots: {
        groups: 'Mock groups'
      },
      propsData: {
        ...defaultProps,
        options: {
          showAxes: false
        }
      }
    })

    const el = wrapper.find('[data-j-adv-chart__axes]');
    expect(el.exists()).toBeFalsy()
  });

  test('mounts component with negative values', () => {
    const wrapper = mount(AdvChart, {
      slots: {
        groups: 'Mock groups'
      },
      propsData: {
        ...defaultProps,
        data: [{ values: data[0].values.map(({ value }) => ({ value: -1 * value })) }],
      }
    })

    const el = wrapper.find('[data-j-adv-chart__negative-values]');
    expect(el.exists()).toBeTruthy();
  });

  test('should show tooltip on bar overlay mouseover event', async () => {
    const wrapper = mount(AdvChart, {
      slots: {
        groups: 'Mock groups'
      },
      propsData: {
        ...defaultProps,
        options: { withTooltip: true }
      }
    });

    expect(wrapper.find('[data-j-adv-chart__tooltip]').exists()).toBe(false);
    const overlay =  wrapper.find('[data-j-adv-overlay-group]');
    await overlay.trigger('mouseover');
    expect(wrapper.find('[data-j-adv-chart__tooltip]').exists()).toBe(true);
  });

  test('should show tooltip on tick-mouseover for x-axis', async () => {
    const wrapper = await mount(AdvChart, {
      slots: {
        groups: 'Mock groups'
      },
      propsData: defaultProps
    });

    expect(wrapper.find('[data-j-adv-chart__tooltip]').exists()).toBe(false);
    const xAxisElement = wrapper.find('[data-j-adv-chart__x-axis]');
    await xAxisElement.find('[data-j-axis__tick-label]').trigger('mouseover');
    expect(wrapper.find('[data-j-adv-chart__tooltip]').exists()).toBe(true);
  });

  test('should show tooltip on tick-mouseover for y-axis with horizontal orientation', async () => {
    const wrapper = await mount(AdvChart, {
      slots: {
        groups: 'Mock groups'
      },
      propsData: {
        ...defaultProps,
        orientation: 'horizontal'
      }
    });

    expect(wrapper.find('[data-j-adv-chart__tooltip]').exists()).toBe(false);
    const yAxisElement = wrapper.find('[data-j-adv-chart__y-axis]');
    await yAxisElement.find('[data-j-axis__tick-label]').trigger('mouseover');
    expect(wrapper.find('[data-j-adv-chart__tooltip]').exists()).toBe(true);
  });

  test('should hide tooltip after root element hover event', async () => {
    const wrapper = await mount(AdvChart, {
      slots: {
        groups: 'Mock groups'
      },
      propsData: defaultProps
    });

    const overlay =  wrapper.find('[data-j-adv-overlay-group]');
    await overlay.trigger('mouseover');
    expect(wrapper.find('[data-j-adv-chart__tooltip]').exists()).toBe(true);
    await wrapper.find('[data-j-chart-container__root]').trigger('mouseleave');
    expect(wrapper.find('[data-j-adv-chart__tooltip]').exists()).toBe(false);
  })
});