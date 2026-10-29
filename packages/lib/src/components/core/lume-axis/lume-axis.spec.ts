import { mount, VueWrapper } from '@vue/test-utils';
import { scaleBand, scaleLinear } from 'd3';

import LumeAxis from './lume-axis.vue';

import { labels } from '@test/unit/mock-data';

import { Scale } from '@/composables/scales';
import { AXIS_GHOST_PADDING } from '@/utils/constants';
import { nextTick } from 'vue';

import { yOptions } from './defaults';

const width = 640;
const scale: Scale = scaleBand<number>()
  .domain(labels.map((_, i) => i))
  .range([0, width]);

describe('lume-axis.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeAxis, {
      props: {
        scale,
      },
    });

    const el = wrapper.find('[data-j-axis]');
    expect(el.exists()).toBeTruthy();
    const ticks = wrapper.findAll('[data-j-axis__tick]');
    expect(el.exists()).toBeTruthy();
    expect(ticks).toHaveLength(7);
    expect(wrapper.emitted('mouseover')).toBeFalsy();
  });

  test('mounts component and sets custom value for skip option to false', () => {
    const wrapper = mount(LumeAxis, {
      props: {
        scale,
        options: { skip: false },
      },
    });

    expect(
      wrapper
        .findAll('[data-j-axis__tick]')
        .filter((record) => record.classes().includes('axis__tick--hidden'))
    ).toHaveLength(0);
  });

  test('mounts component and sets custom value for skip option to 2', async () => {
    const skip = 2;
    const wrapper = mount(LumeAxis, {
      props: {
        scale,
        options: { skip },
      },
    });

    await nextTick();

    expect(
      wrapper
        .findAll('[data-j-axis__tick]')
        .filter((record) => record.classes().includes('axis__tick--hidden'))
    ).toHaveLength(Math.ceil(labels.length / skip));
  });

  describe('tickAlign option', () => {
    const CHAR_WIDTH = 10;
    const yLinearScale = scaleLinear().domain([0, 1000]).range([300, 0]);
    const yBandScale = scaleBand<string>()
      .domain(['A', 'Bbbb', 'Cc'])
      .range([0, 300]);

    const getLabels = (wrapper: VueWrapper) =>
      wrapper.findAll('[data-j-axis__tick] .axis__label');
    const getGhosts = (wrapper: VueWrapper) =>
      wrapper.findAll('[data-j-axis__tick] .axis__ghost');

    // jsdom doesn't implement SVG text measurement
    beforeAll(() => {
      Object.assign(Element.prototype, {
        getComputedTextLength(this: Element) {
          return this.textContent.trim().length * CHAR_WIDTH;
        },
      });
    });

    afterAll(() => {
      Reflect.deleteProperty(Element.prototype, 'getComputedTextLength');
    });

    test('right-aligns y axis labels by default', async () => {
      const wrapper = mount(LumeAxis, {
        props: { scale: yLinearScale, type: 'y' },
      });

      await nextTick();

      getLabels(wrapper).forEach((label) => {
        expect(label.attributes('text-anchor')).toBe('end');
        expect(label.attributes('x')).toBe(String(-yOptions.tickPadding));
      });
    });

    test.each([
      ['linear', yLinearScale, '1000'],
      ['band', yBandScale, 'Bbbb'],
    ])(
      'left-aligns %s y axis labels on the widest label with tickAlign: start',
      async (_, yScale, widestLabel) => {
        const tickPadding = 8;
        const wrapper = mount(LumeAxis, {
          props: {
            scale: yScale as Scale,
            type: 'y',
            options: { tickAlign: 'start', tickPadding },
          },
        });

        await nextTick();

        const maxLabelWidth = widestLabel.length * CHAR_WIDTH;
        const labels = getLabels(wrapper);

        expect(labels.length).toBeGreaterThan(1);
        labels.forEach((label) => {
          expect(label.attributes('text-anchor')).toBe('start');
          expect(label.attributes('x')).toBe(
            String(-(maxLabelWidth + tickPadding))
          );
        });

        const ghostWidth = maxLabelWidth + tickPadding + AXIS_GHOST_PADDING;
        getGhosts(wrapper).forEach((ghost) => {
          expect(ghost.attributes('x')).toBe(String(-ghostWidth));
          expect(ghost.attributes('width')).toBe(String(ghostWidth));
        });
      }
    );

    test('ignores tickAlign on x axes', async () => {
      const wrapper = mount(LumeAxis, {
        props: { scale, type: 'x', options: { tickAlign: 'start' } },
      });

      await nextTick();

      getLabels(wrapper).forEach((label) => {
        expect(label.attributes('text-anchor')).toBe('middle');
      });
    });
  });

  describe('Events API', () => {
    it('should dispatch `click` if user clicks an axis tick', async () => {
      const wrapper = mount(LumeAxis, { props: { scale } });

      const ticks = wrapper.findAll('[data-j-axis__tick=""]');

      await ticks[0].trigger('click');
      await ticks[3].trigger('click');

      expect(wrapper.emitted()).toHaveProperty('click');
      expect(wrapper.emitted().click).toHaveLength(2);
    });

    it('should dispatch `mouseenter` if user mouses over an axis tick', async () => {
      const wrapper = mount(LumeAxis, { props: { scale } });

      const ticks = wrapper.findAll('[data-j-axis__tick=""]');

      await ticks[0].trigger('mouseenter');
      await ticks[3].trigger('mouseenter');

      expect(wrapper.emitted()).toHaveProperty('mouseenter');
      expect(wrapper.emitted().mouseenter).toHaveLength(2);
    });

    it('should dispatch `mouseleave` if user moves mouse away from an axis', async () => {
      const wrapper = mount(LumeAxis, { props: { scale } });

      await wrapper.trigger('mouseleave');

      expect(wrapper.emitted()).toHaveProperty('mouseleave');
      expect(wrapper.emitted().mouseleave).toHaveLength(1);
    });
  });
});
