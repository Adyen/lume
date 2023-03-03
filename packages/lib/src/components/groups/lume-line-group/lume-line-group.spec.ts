import { ref } from 'vue';
import { mount } from '@vue/test-utils';

import LumeLineGroup from './lume-line-group.vue';

import { data, xScale, yScale } from '@test/unit/mock-data';

import { getXByIndex } from '@/composables/scales';

const defaultprops = { data, xScale, yScale };

describe('lume-line-group.vue', () => {
  test('mounts component and sets prop values', () => {
    const wrapper = mount(LumeLineGroup, {
      props: defaultprops,
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
      props: {
        ...defaultprops,
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

  test('mounts without points', () => {
    const wrapper = mount(LumeLineGroup, {
      props: {
        ...defaultprops,
        withPoints: false,
      },
      provide: {
        tooltipAnchorAttributes() {
          return ref([]);
        },
      },
    });

    const el = wrapper.find('[data-j-lume-line-group__points]');
    expect(el.exists()).toBeFalsy();
  });
});
