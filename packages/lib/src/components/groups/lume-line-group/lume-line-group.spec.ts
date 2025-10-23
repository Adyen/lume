import { ref } from 'vue';
import { mount } from '@vue/test-utils';

import LumeLineGroup from './lume-line-group.vue';

import { data, xScale, yScale } from '@test/unit/mock-data';

import { getXByIndex } from '@/composables/scales';

const defaultProps = { data, xScale, yScale };

document.body.innerHTML = `<svg id="root"></svg>`; // prevent no SVG parent console.warn

describe('lume-line-group.vue', () => {
  const svg = document.getElementById('root');

  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeLineGroup, {
      attachTo: svg,
      props: defaultProps,
      provide: {
        tooltipAnchorAttributes() {
          return ref([]);
        },
      },
    });

    const el = wrapper.find('[data-j-lume-line-group]');
    expect(el.exists()).toBeTruthy();
    expect(el.find('[data-j-lume-line-group__points]').exists()).toBeTruthy();
    expect(el.attributes()['d']).toBeFalsy();
    expect(true).toBe(true);
  });

  test('mounts and creates path if hoveredIndex is set', () => {
    const hoveredIndex = 1;
    const peak = data[0].values[hoveredIndex].value;
    const x = getXByIndex(xScale, hoveredIndex);
    const d = `M ${x},${yScale.range()[1]}
        V ${yScale(peak)}`;

    const wrapper = mount(LumeLineGroup, {
      attachTo: svg,
      props: {
        ...defaultProps,
        hoveredIndex,
      },
      provide: {
        tooltipAnchorAttributes() {
          return ref([]);
        },
      },
    });

    const el = wrapper.find('[data-j-lume-line-group__overlay-line]');
    expect(el.attributes()['d']).toEqual(d);
  });

  test('mounts without points (via prop)', () => {
    const wrapper = mount(LumeLineGroup, {
      attachTo: svg,
      props: { ...defaultProps, withPoints: false },
      provide: {
        tooltipAnchorAttributes() {
          return ref([]);
        },
      },
    });

    const el = wrapper.find('[data-j-lume-line-group__points]');
    expect(el.exists()).toBeFalsy();
  });

  test('mounts without points (via options)', () => {
    const wrapper = mount(LumeLineGroup, {
      attachTo: svg,
      props: { ...defaultProps, options: { withPoints: false } },
      provide: {
        tooltipAnchorAttributes() {
          return ref([]);
        },
      },
    });

    const el = wrapper.find('[data-j-lume-line-group__points]');
    expect(el.exists()).toBeFalsy();
  });

  test('mounts with visible points (via options)', () => {
    const wrapper = mount(LumeLineGroup, {
      attachTo: svg,
      props: { ...defaultProps, options: { withPoints: 'visible' } },
      provide: {
        tooltipAnchorAttributes() {
          return ref([]);
        },
      },
    });

    const pointsGroup = wrapper.find('[data-j-lume-line-group__points]');
    expect(pointsGroup.exists()).toBeTruthy();

    const points = wrapper.findAll('.lume-point');
    expect(points.length).toBeGreaterThan(0);

    // When withPoints is "visible", points should be rendered with a radius > 0
    points.forEach((p) => {
      expect(Number(p.attributes('r'))).toBeGreaterThan(0);
    });
  });

  describe('Events API', () => {
    it('should dispatch `line-click` if user clicks a line', async () => {
      const wrapper = mount(LumeLineGroup, {
        attachTo: svg,
        props: defaultProps,
      });

      const lines = wrapper.findAll('.lume-line');

      await lines[0].trigger('click');
      await lines[2].trigger('click');

      expect(wrapper.emitted()).toHaveProperty('line-click');

      expect(wrapper.emitted()['line-click']).toHaveLength(2);

      expect(wrapper.emitted()['line-click'][0][0].index).toBe(0);
      expect(wrapper.emitted()['line-click'][1][0].index).toBe(2);
    });

    it('should dispatch `point-click` if user clicks a point', async () => {
      const wrapper = mount(LumeLineGroup, {
        attachTo: svg,
        props: defaultProps,
      });

      const points = wrapper.findAll('.lume-point');

      await points[0].trigger('click');
      await points[2].trigger('click');

      expect(wrapper.emitted()).toHaveProperty('point-click');

      expect(wrapper.emitted()['point-click']).toHaveLength(2);

      expect(wrapper.emitted()['point-click'][0][0].index).toBe(0);
      expect(wrapper.emitted()['point-click'][1][0].index).toBe(2);
    });
  });
});
